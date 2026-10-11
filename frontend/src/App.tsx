import { Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dwell" replace />} />
            <Route path="/dwell" element={<div>Dwell — Housing Layer</div>} />
            <Route path="/trade" element={<div>Trade — Marketplace Layer</div>} />
            <Route path="/login" element={<div>Login</div>} />
            <Route path="/register" element={<div>Register</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
