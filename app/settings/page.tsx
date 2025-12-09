import MemberGuard from "../common/authguard/MemberGuard";


export default function SettingsPageAuth() {
    return (
        <MemberGuard>
            <SettingsPage />
        </MemberGuard>
    )
}

function SettingsPage() {
    return (
        <div></div>
    )
}