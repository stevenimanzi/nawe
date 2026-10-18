import React from 'react'
import { Container, PageHeader } from './Layout'

export interface DocSection {
    heading: string
    body: (string | string[])[]
}

interface DocPageProps {
    title: string
    subtitle?: string
    updated?: string
    sections: DocSection[]
    after?: React.ReactNode
}

/** Long-form reading page: legal text, guides. */
export const DocPage: React.FC<DocPageProps> = ({ title, subtitle, updated, sections, after }) => (
    <>
        <PageHeader title={title} subtitle={subtitle} crumbs={[{ label: 'Home', to: '/' }, { label: title }]} />
        <Container className="py-12">
            <article className="mx-auto max-w-3xl">
                {updated && <p className="mb-10 text-sm text-slate-400">Last updated {updated}</p>}
                {sections.map((s) => (
                    <section key={s.heading} className="mb-10">
                        <h2 className="text-2xl font-semibold text-white">{s.heading}</h2>
                        <div className="mt-4 space-y-4">
                            {s.body.map((block, i) =>
                                Array.isArray(block) ? (
                                    <ul key={i} className="list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-slate-300 marker:text-slate-500">
                                        {block.map((li) => (
                                            <li key={li}>{li}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p key={i} className="text-[15px] leading-relaxed text-slate-300">
                                        {block}
                                    </p>
                                ),
                            )}
                        </div>
                    </section>
                ))}
                {after}
            </article>
        </Container>
    </>
)
