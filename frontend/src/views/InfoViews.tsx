import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import api, { errorMessage, fieldErrors } from '@/services/api'
import { CONTACT } from '@/lib/contact'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, ButtonLink } from '@/components/ui/Button'
import { DocPage } from '@/components/ui/Doc'
import { TextArea, TextField } from '@/components/ui/Field'
import { Container, PageHeader } from '@/components/ui/Layout'

const UPDATED = '16 October 2026'

/* ---------------- Contact ---------------- */

export const ContactView: React.FC = () => {
    const { user } = useAuth()
    const toast = useToast()
    const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', subject: '', message: '' })
    const [busy, setBusy] = useState(false)
    const [sent, setSent] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formError, setFormError] = useState('')

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }))

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setBusy(true)
        setErrors({})
        setFormError('')
        try {
            await api.post('/v1/contact', form)
            setSent(true)
            toast.success('Message sent. We will reply by email.')
        } catch (err) {
            const fields = fieldErrors(err)
            setErrors(fields)
            if (Object.keys(fields).length === 0) setFormError(errorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    const details = [
        { icon: Phone, label: 'Call us', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
        { icon: MessageCircle, label: 'WhatsApp', value: CONTACT.phoneDisplay, href: CONTACT.whatsappHref },
        { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
        { icon: MapPin, label: 'Visit', value: CONTACT.address },
    ]

    return (
        <>
            <PageHeader title="Contact us" subtitle="Questions, feedback or a problem with a listing? We read every message." crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact us' }]} />
            <Container className="py-12">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    {sent ? (
                        <div className="rounded-3xl bg-panel p-10 text-center ring-1 ring-white/10">
                            <h2 className="text-2xl font-semibold text-white">Thank you, we got your message</h2>
                            <p className="mt-3 text-[15px] text-slate-300">We will reply to {form.email} as soon as we can.</p>
                            <ButtonLink to="/" variant="secondary" className="mt-8">
                                Back to home
                            </ButtonLink>
                        </div>
                    ) : (
                        <form onSubmit={submit} noValidate className="space-y-6 rounded-3xl bg-panel p-8 ring-1 ring-white/10 sm:p-10">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <TextField label="Your name" value={form.name} onChange={set('name')} error={errors.name} required />
                                <TextField label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} required />
                            </div>
                            <TextField label="Subject" value={form.subject} onChange={set('subject')} error={errors.subject} maxLength={160} required />
                            <TextArea label="Message" rows={7} value={form.message} onChange={set('message')} error={errors.message} hint="At least 10 characters." maxLength={4000} required />
                            {formError && (
                                <p role="alert" className="text-sm text-[#f0827a]">
                                    {formError}
                                </p>
                            )}
                            <Button type="submit" size="lg" loading={busy} disabled={!form.name || !form.email || !form.subject || form.message.length < 10}>
                                Send message
                            </Button>
                        </form>
                    )}

                    <aside>
                        <ul className="space-y-6">
                            {details.map(({ icon: Icon, label, value, href }) => (
                                <li key={label} className="flex items-start gap-4">
                                    <Icon className="mt-0.5 size-6 shrink-0 text-slate-300" aria-hidden />
                                    <div>
                                        <p className="text-sm text-slate-400">{label}</p>
                                        {href ? (
                                            <a href={href} className="text-[15px] font-semibold text-white hover:underline" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                                                {value}
                                            </a>
                                        ) : (
                                            <p className="text-[15px] font-semibold text-white">{value}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                            <li className="border-t border-white/10 pt-6 text-sm text-slate-400">Open {CONTACT.hours}</li>
                        </ul>
                    </aside>
                </div>
            </Container>
        </>
    )
}

/* ---------------- Help centre ---------------- */

const FAQ = [
    {
        q: 'How do I post something?',
        a: 'Create an account, verify your ID once, then choose Post Listing. Add clear photos, a price and a short description. Your listing goes live straight away.',
    },
    {
        q: 'Why do I have to verify my ID?',
        a: 'Everyone who sells, rents out or lists a room on NAWE shows a valid ID. This protects buyers and tenants from scams and shows you are a real person. Your documents are only seen by the NAWE review team and never appear on your listing.',
    },
    {
        q: 'How long does ID verification take?',
        a: 'Most reviews are done within one working day. You can see your status on the Verify your ID page, and you will be able to post as soon as it is approved.',
    },
    {
        q: 'How do I rent something from a neighbour?',
        a: 'Open Rent from Neighbours, find what you need, and message the owner to agree dates, price and pick-up. Pay only when you meet and have seen the item.',
    },
    {
        q: 'How do I find houses around me?',
        a: 'Go to Shelter & Gueto and choose Houses around me. Your browser will ask for permission to use your location. Then pick how far you are willing to travel and the map shows every place within that distance.',
    },
    {
        q: 'Can I list a room if I am not a landlord?',
        a: 'Only landlord accounts can list rooms and houses. You can switch your account type in Account, then Profile.',
    },
    {
        q: 'How do I mark something as sold or rented?',
        a: 'Open Account, then My listings, and use the buttons next to the listing. Sold and rented listings are hidden from search.',
    },
    {
        q: 'Someone asked me to pay in advance. What should I do?',
        a: 'Do not send money. Meet in person, check the item or place first, and report the listing using the Report this listing button so our team can act.',
    },
    {
        q: 'I forgot my password.',
        a: 'Contact us from the Contact page with the email you registered with and we will help you get back in.',
    },
]

export const HelpView: React.FC = () => {
    useDocumentTitle('Help Centre')
    return (
        <>
            <PageHeader title="Help Centre" subtitle="Quick answers to the things people ask most." crumbs={[{ label: 'Home', to: '/' }, { label: 'Help Centre' }]} />
            <Container className="py-12">
                <div className="mx-auto max-w-3xl">
                    <ul className="divide-y divide-white/10 rounded-3xl bg-panel ring-1 ring-white/10">
                        {FAQ.map((f) => (
                            <li key={f.q}>
                                <details className="group p-6">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-white [&::-webkit-details-marker]:hidden">
                                        {f.q}
                                        <span className="shrink-0 text-2xl leading-none text-slate-400 transition-transform group-open:rotate-45" aria-hidden>
                                            +
                                        </span>
                                    </summary>
                                    <p className="mt-4 text-[15px] leading-relaxed text-slate-300">{f.a}</p>
                                </details>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-10 text-center text-[15px] text-slate-300">
                        Still stuck?{' '}
                        <Link to="/contact" className="font-semibold text-white underline underline-offset-2">
                            Contact us
                        </Link>
                        .
                    </p>
                </div>
            </Container>
        </>
    )
}

/* ---------------- Guides ---------------- */

export const SafetyView: React.FC = () => (
    <DocPage
        title="Safety tips"
        subtitle="Most deals go smoothly. These habits keep it that way."
        sections={[
            {
                heading: 'Buying and renting items',
                body: [
                    [
                        'Meet in a public, busy place, ideally in daylight.',
                        'Check the item works before you pay. Try the phone, plug in the machine, look at the suit in good light.',
                        'Never send money in advance, including "deposits" or "delivery fees", to someone you have not met.',
                        'Prefer cash or mobile money at the moment you receive the item, and keep the message history.',
                        'If a price looks too good to be true, it usually is.',
                    ],
                ],
            },
            {
                heading: 'Finding a room or house',
                body: [
                    [
                        'Visit in person and meet the landlord before you pay anything.',
                        'Ask to see the room, the water and power supply, and the neighbourhood.',
                        'Agree the rent, deposit and rules in writing, and ask for a signed receipt for any payment.',
                        'Check that the person showing you the place is the landlord or their authorised agent. Verified landlords carry the gold badge on their listings.',
                    ],
                ],
            },
            {
                heading: 'If you are selling or renting something out',
                body: [
                    [
                        'Share your exact location only when you are sure the person is serious.',
                        'For rentals, agree the return date, condition and any deposit before you hand the item over.',
                        'Ask for an ID when lending something valuable.',
                    ],
                ],
            },
            {
                heading: 'If something feels wrong',
                body: [
                    'Stop the conversation and do not pay. Open the listing and choose Report this listing so our team can review it. If you are in danger, contact the Rwanda National Police on 112.',
                ],
            },
        ]}
        after={
            <div className="flex flex-wrap gap-3">
                <ButtonLink to="/trade">Browse the marketplace</ButtonLink>
                <ButtonLink to="/contact" variant="secondary">
                    Contact us
                </ButtonLink>
            </div>
        }
    />
)

export const LandlordGuideView: React.FC = () => (
    <DocPage
        title="Landlord guide"
        subtitle="Fill your room quickly with the right tenant."
        sections={[
            {
                heading: 'Get set up',
                body: [
                    [
                        'Create an account and choose Landlord, or switch your account type in Account.',
                        'Verify your ID once. Verified landlords show a gold badge, which tenants look for.',
                        'Choose Post Listing, then List a room or house.',
                    ],
                ],
            },
            {
                heading: 'Write a listing that gets replies',
                body: [
                    [
                        'Use bright, clear photos: the room, the bathroom, the entrance and the street.',
                        'State the rent and deposit honestly, and what is included: water, electricity, Wi-Fi, furniture, parking.',
                        'Pin the exact location on the map. Tenants search by distance, so a listing without a pin is easy to miss.',
                        'Describe the neighbourhood and house rules, and who the place suits.',
                    ],
                ],
            },
            {
                heading: 'Choosing a tenant',
                body: [
                    [
                        'Reply quickly. Most people message several landlords at once.',
                        'Meet the tenant in person and agree the rules before any money changes hands.',
                        'Write down the rent, deposit and notice period, and give a signed receipt for every payment.',
                    ],
                ],
            },
            {
                heading: 'Keep your listing up to date',
                body: ['When the room is taken, mark it as rented in Account, then My listings, so people stop contacting you. You can make it available again at any time.'],
            },
        ]}
        after={<ButtonLink to="/post/housing">List a place</ButtonLink>}
    />
)

export const ReportInfoView: React.FC = () => (
    <DocPage
        title="Report a listing"
        subtitle="Help us keep NAWE honest."
        sections={[
            {
                heading: 'How to report',
                body: [
                    [
                        'Open the listing you are worried about.',
                        'Choose Report this listing under the seller or landlord panel.',
                        'Pick the reason and add any detail that helps us, then send it.',
                    ],
                    'You need to be signed in to report, so we can follow up if we need more information. Reports are reviewed by the NAWE team, and listings that break the rules are removed.',
                ],
            },
            {
                heading: 'What to report',
                body: [['Scams or requests to pay in advance', 'Items or places that are not as described', 'Illegal or prohibited items', 'Offensive content', 'Duplicate listings']],
            },
            {
                heading: 'Something else?',
                body: ['If you cannot find the listing, or you want to report a person rather than a listing, use the Contact page and include as much detail as you can.'],
            },
        ]}
        after={
            <div className="flex flex-wrap gap-3">
                <ButtonLink to="/trade">Browse listings</ButtonLink>
                <ButtonLink to="/contact" variant="secondary">
                    Contact us
                </ButtonLink>
            </div>
        }
    />
)

/* ---------------- Legal ---------------- */

export const TermsView: React.FC = () => (
    <DocPage
        title="Terms of Service"
        subtitle="The rules for using NAWE, in plain language."
        updated={UPDATED}
        sections={[
            {
                heading: '1. About NAWE',
                body: ['NAWE is an online marketplace in Rwanda where people list second-hand goods, items to rent, and rooms and houses to let. NAWE connects people. We are not a party to the deals you make, and we do not own, inspect or guarantee any item or property.'],
            },
            {
                heading: '2. Your account',
                body: [
                    [
                        'You must give accurate information and keep your password private.',
                        'You are responsible for everything done through your account.',
                        'To sell, rent out or list a property you must verify your identity with a valid ID. We may refuse or remove verification if the documents are not genuine.',
                    ],
                ],
            },
            {
                heading: '3. Listings',
                body: [
                    [
                        'You may only list things you own or have the right to sell, rent or let.',
                        'Listings must be honest: accurate descriptions, real photos and the real price.',
                        'Prohibited items include anything illegal, stolen, counterfeit, dangerous, or that breaks Rwandan law.',
                        'We may remove any listing, or suspend any account, that breaks these terms or that we believe is fraudulent.',
                    ],
                ],
            },
            {
                heading: '4. Deals between users',
                body: [
                    'Prices, payment, delivery, deposits and returns are agreed between you and the other person. Meet in person, inspect before you pay, and never pay in advance to someone you have not met. NAWE is not responsible for losses from deals made through the platform, but we will act on reports of misuse.',
                ],
            },
            {
                heading: '5. Acceptable use',
                body: [['Do not harass, threaten or deceive other users.', 'Do not copy or scrape the site, or interfere with how it works.', 'Do not use NAWE to send spam or advertising unrelated to your listing.']],
            },
            {
                heading: '6. Content you post',
                body: ['You keep ownership of your photos and text. By posting them you allow NAWE to display them on the platform so your listing can work. You promise you have the right to share them.'],
            },
            {
                heading: '7. Limits of liability',
                body: ['NAWE is provided as is. To the extent allowed by law, we are not liable for indirect loss or for what users say or do. Nothing in these terms limits liability that cannot be limited by law.'],
            },
            {
                heading: '8. Changes and contact',
                body: [`We may update these terms and will show the date above when we do. Continuing to use NAWE means you accept the updated terms. Questions? Write to ${CONTACT.email} or use the Contact page.`],
            },
        ]}
    />
)

export const PrivacyView: React.FC = () => (
    <DocPage
        title="Privacy Policy"
        subtitle="What we collect, why, and the choices you have."
        updated={UPDATED}
        sections={[
            {
                heading: 'What we collect',
                body: [
                    [
                        'Account details: your name, email, phone number (optional) and password. Passwords are stored only in hashed form.',
                        'Verification documents: the ID photos and details you submit so we can verify you.',
                        'Listings and messages: what you post, and the messages you send and receive on NAWE.',
                        'Saved listings and reports you make.',
                        'Location: only if you tap "Near me" or "Houses around me", or pin a listing on the map. Your browser asks for permission first.',
                    ],
                ],
            },
            {
                heading: 'How we use it',
                body: [
                    [
                        'To run the marketplace: show your listings, deliver your messages and show listings near you.',
                        'To keep NAWE safe: verify identities, review reports and prevent fraud.',
                        'To reply to you when you contact us.',
                    ],
                    'We do not sell your personal information.',
                ],
            },
            {
                heading: 'What other people can see',
                body: ['Your name, whether you are ID verified and when you joined appear on your listings. Your phone number is shown only to signed-in members. Your email, ID documents and exact location are never shown publicly.'],
            },
            {
                heading: 'Your location',
                body: ['When you use Near me, your position is rounded to about 100 metres, kept only for your current browser session, and used to sort and filter listings. It is not stored on your account.'],
            },
            {
                heading: 'Services we rely on',
                body: ['Maps are drawn with OpenStreetMap, and some photos are delivered by Unsplash. Your browser contacts those services directly when it loads a map or such a photo, so they receive your IP address as part of that request.'],
            },
            {
                heading: 'Keeping and deleting data',
                body: [`We keep your data while your account is active. To correct or delete your information, write to ${CONTACT.email}. We may keep records we are legally required to keep.`],
            },
            {
                heading: 'Security',
                body: ['Connections to NAWE are encrypted, and access to verification documents is limited to the review team. No system is perfectly secure, so please use a strong, unique password.'],
            },
        ]}
    />
)

export const CookiesView: React.FC = () => (
    <DocPage
        title="Cookie Policy"
        subtitle="NAWE keeps things simple: no tracking, no advertising cookies."
        updated={UPDATED}
        sections={[
            {
                heading: 'What we store in your browser',
                body: [
                    [
                        'Sign-in token (local storage): keeps you signed in. It is removed when you sign out.',
                        'Your last location (session storage): remembered only while the tab is open, so "near me" results work without asking again.',
                    ],
                    'These are strictly necessary for the site to work, so we do not ask for consent to use them.',
                ],
            },
            {
                heading: 'What we do not do',
                body: ['We do not use advertising or analytics cookies, and we do not build profiles of you for third parties.'],
            },
            {
                heading: 'Third-party content',
                body: ['Maps (OpenStreetMap) and some photos (Unsplash) load from those services. They may set their own technical cookies or log requests. Please see their policies for details.'],
            },
            {
                heading: 'Your choices',
                body: ['You can clear your browser storage at any time, which signs you out. Blocking storage entirely will stop sign-in from working.'],
            },
        ]}
    />
)

/* ---------------- Not found ---------------- */

export const NotFoundView: React.FC = () => {
    useDocumentTitle('Page not found')
    return (
        <div className="mx-auto flex max-w-lg flex-col items-center px-[30px] py-28 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Error 404</p>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">We cannot find that page</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-300">The link may be old, or the page may have moved.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink to="/">Go home</ButtonLink>
                <ButtonLink to="/trade" variant="secondary">
                    Browse the marketplace
                </ButtonLink>
            </div>
        </div>
    )
}
