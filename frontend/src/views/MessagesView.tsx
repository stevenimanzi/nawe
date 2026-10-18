import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, BadgeCheck, Send } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useConversations, useSendMessage, useThread } from '@/hooks/queries'
import { useUrlState } from '@/hooks/useUrlState'
import { errorMessage } from '@/services/api'
import { timeAgo } from '@/lib/format'
import type { Conversation, EntityType } from '@/types'
import { Container, PageHeader } from '@/components/ui/Layout'
import { EmptyState, ErrorState, Spinner } from '@/components/ui/States'

const entityPath = (type: EntityType, id: number) => (type === 'housing_listing' ? `/dwell/${id}` : `/trade/${id}`)

export const MessagesView: React.FC = () => {
    const { params } = useUrlState()
    const { data: conversations, isLoading, isError, refetch } = useConversations()

    const withId = Number(params.get('with'))
    const type = params.get('type') as EntityType | null
    const entityId = Number(params.get('id'))
    const selected =
        withId && entityId && (type === 'housing_listing' || type === 'marketplace_item')
            ? { with: withId, entity_type: type, entity_id: entityId }
            : null

    return (
        <>
            <PageHeader title="Messages" subtitle="Your conversations with sellers, landlords and buyers." crumbs={[{ label: 'Home', to: '/' }, { label: 'Messages' }]} />
            <Container className="py-8">
                {isLoading ? (
                    <Spinner />
                ) : isError ? (
                    <ErrorState onRetry={() => refetch()} />
                ) : !conversations || (conversations.length === 0 && !selected) ? (
                    <EmptyState
                        title="No messages yet"
                        text="When you contact a seller or landlord, or someone contacts you, the conversation shows up here."
                        action={{ label: 'Browse the marketplace', to: '/trade' }}
                    />
                ) : (
                    <div className="grid overflow-hidden rounded-3xl bg-panel ring-1 ring-white/10 lg:h-[72vh] lg:grid-cols-[22rem_minmax(0,1fr)]">
                        <ConversationList conversations={conversations} selected={selected} className={selected ? 'hidden lg:flex' : 'flex'} />
                        <div className={`${selected ? 'flex' : 'hidden lg:flex'} min-h-[60vh] flex-col border-white/10 lg:border-l`}>
                            {selected ? (
                                <Thread
                                    key={`${selected.with}-${selected.entity_type}-${selected.entity_id}`}
                                    selected={selected}
                                    summary={conversations.find(
                                        (c) => c.other_user.id === selected.with && c.entity_type === selected.entity_type && c.entity_id === selected.entity_id,
                                    )}
                                />
                            ) : (
                                <div className="grid flex-1 place-items-center p-10 text-center text-slate-400">Choose a conversation to read it.</div>
                            )}
                        </div>
                    </div>
                )}
            </Container>
        </>
    )
}

const ConversationList: React.FC<{
    conversations: Conversation[]
    selected: { with: number; entity_type: EntityType; entity_id: number } | null
    className?: string
}> = ({ conversations, selected, className = '' }) => (
    <ul className={`max-h-[72vh] flex-col overflow-y-auto ${className}`}>
        {conversations.map((c) => {
            const active = selected?.with === c.other_user.id && selected.entity_type === c.entity_type && selected.entity_id === c.entity_id
            return (
                <li key={`${c.other_user.id}-${c.entity_type}-${c.entity_id}`} className="border-b border-white/10 last:border-0">
                    <Link
                        to={`/messages?with=${c.other_user.id}&type=${c.entity_type}&id=${c.entity_id}`}
                        className={`flex gap-4 p-4 transition-colors hover:bg-white/5 ${active ? 'bg-panel-2' : ''}`}
                    >
                        <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-canvas">
                            {c.entity_image && <img src={c.entity_image} alt="" className="size-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                                <p className="truncate text-[15px] font-semibold text-white">{c.other_user.name}</p>
                                <span className="shrink-0 text-xs text-slate-400">{timeAgo(c.last_message_at)}</span>
                            </div>
                            <p className="truncate text-xs text-slate-400">{c.entity_title}</p>
                            <div className="mt-1 flex items-center justify-between gap-3">
                                <p className={`truncate text-sm ${c.unread_count ? 'font-semibold text-white' : 'text-slate-300'}`}>
                                    {c.last_from_me && 'You: '}
                                    {c.last_message}
                                </p>
                                {c.unread_count > 0 && (
                                    <span className="grid min-w-5 shrink-0 place-items-center rounded-full bg-white px-1.5 text-xs font-bold text-[#111111]">
                                        {c.unread_count}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                </li>
            )
        })}
    </ul>
)

const Thread: React.FC<{
    selected: { with: number; entity_type: EntityType; entity_id: number }
    summary?: Conversation
}> = ({ selected, summary }) => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { data: messages, isLoading, isError } = useThread(selected)
    const send = useSendMessage()
    const [text, setText] = useState('')
    const [error, setError] = useState('')
    const bottom = useRef<HTMLDivElement>(null)

    // Opening a thread marks it read on the server: refresh the badges.
    useEffect(() => {
        if (messages) {
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
            queryClient.invalidateQueries({ queryKey: ['unread-count'] })
        }
    }, [messages?.length, queryClient]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        bottom.current?.scrollIntoView({ block: 'end' })
    }, [messages?.length])

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault()
        const content = text.trim()
        if (!content) return
        setError('')
        send.mutate(
            { receiver_id: selected.with, messageable_type: selected.entity_type, messageable_id: selected.entity_id, content },
            {
                onSuccess: () => setText(''),
                onError: (err) => setError(errorMessage(err)),
            },
        )
    }

    return (
        <>
            <header className="flex items-center gap-4 border-b border-white/10 p-4">
                <button type="button" onClick={() => navigate('/messages')} aria-label="Back to conversations" className="cursor-pointer text-white lg:hidden">
                    <ArrowLeft className="size-6" aria-hidden />
                </button>
                <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-[15px] font-semibold text-white">
                        {summary?.other_user.name ?? 'Conversation'}
                        {summary?.other_user.is_kyc_verified && <BadgeCheck className="size-4 shrink-0 text-gold" aria-label="ID verified" />}
                    </p>
                    <Link to={entityPath(selected.entity_type, selected.entity_id)} className="block truncate text-sm text-slate-300 underline-offset-2 hover:underline">
                        {summary?.entity_title ?? 'View listing'}
                    </Link>
                </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-5" aria-live="polite">
                {isLoading ? (
                    <Spinner />
                ) : isError ? (
                    <p className="text-center text-sm text-slate-400">We could not load this conversation.</p>
                ) : (
                    messages?.map((m) => {
                        const mine = m.sender_id === user?.id
                        return (
                            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${mine ? 'rounded-br-md bg-action text-white' : 'rounded-bl-md bg-panel-2 text-white'}`}>
                                    <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{m.content}</p>
                                    <p className={`mt-1 text-[11px] ${mine ? 'text-white/70' : 'text-slate-400'}`}>{timeAgo(m.created_at)}</p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={bottom} />
            </div>

            <form onSubmit={submit} className="border-t border-white/10 p-4">
                {error && (
                    <p role="alert" className="mb-2 text-sm text-[#f0827a]">
                        {error}
                    </p>
                )}
                <div className="flex items-end gap-3">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                submit()
                            }
                        }}
                        rows={1}
                        maxLength={2000}
                        placeholder="Write a message…"
                        aria-label="Write a message"
                        className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl bg-canvas/70 px-4 py-3 text-[15px] text-white ring-1 ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                        type="submit"
                        disabled={!text.trim() || send.isPending}
                        aria-label="Send message"
                        className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-action text-white transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send className="size-5" aria-hidden />
                    </button>
                </div>
            </form>
        </>
    )
}
