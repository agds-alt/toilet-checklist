import DashboardWrapper from '@/components/layout/DashboardWrapper';

export default function UploadLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardWrapper>{children}</DashboardWrapper>;
}