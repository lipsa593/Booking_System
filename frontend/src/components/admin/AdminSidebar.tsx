import { ArrowLeft, CalendarDays, Flower2, Scissors, Sparkles, Tags, UserRound, Clock3 } from 'lucide-react';
import { Link } from 'wouter';

export type AdminTab = 'Overview' | 'Services' | 'Team' | 'Team Availability' | 'Brands' | 'Appointments';

const adminTabs: AdminTab[] = ['Overview', 'Services', 'Team', 'Team Availability', 'Brands', 'Appointments'];

type AdminSidebarProps = {
  currentTab: AdminTab;
  upcomingCount: number;
  onChangeTab: (tab: AdminTab) => void;
};

export function AdminSidebar({ currentTab, upcomingCount, onChangeTab }: AdminSidebarProps) {
  function getTabIcon(tab: AdminTab) {
    switch (tab) {
      case 'Overview':
        return <Sparkles size={17} />;
      case 'Services':
        return <Scissors size={17} />;
      case 'Team':
        return <UserRound size={17} />;
      case 'Team Availability':
        return <Clock3 size={17} />;
      case 'Brands':
        return <Tags size={17} />;
      case 'Appointments':
        return <CalendarDays size={17} />;
    }
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-title">
        <span className="admin-logo"><Flower2 size={20} /></span>
        <div>
          <b>Mysa House</b>
          <small>STUDIO ADMIN</small>
        </div>
      </div>

      <p className="sidebar-label">WORKSPACE</p>
      {adminTabs.map(tab => (
        <button
          key={tab}
          className={`side-tab ${currentTab === tab ? 'active' : ''}`}
          onClick={() => onChangeTab(tab)}
        >
          {getTabIcon(tab)}
          <span>{tab}</span>
          {tab === 'Appointments' && <small>{upcomingCount}</small>}
        </button>
      ))}

      <div className="sidebar-bottom">
        <div className="admin-user">
          <span>MH</span>
          <div>
            <b>Mysa House</b>
            <small>Demo workspace</small>
          </div>
        </div>
        <Link href="/" className="exit-link">
          <ArrowLeft size={15} />
          Back to salon
        </Link>
      </div>
    </aside>
  );
}
