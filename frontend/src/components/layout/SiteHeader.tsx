import { ArrowRight, Bell, ChevronDown, Flower2, UserRound } from 'lucide-react';
import { Link } from 'wouter';

type SiteHeaderProps = {
  role: string;
  isLoggedIn: boolean;
  notificationCount: number;
  onRoleChange: (role: string) => void;
  onCustomerNavigate: () => void;
};

export function SiteHeader({ role, isLoggedIn, notificationCount, onRoleChange, onCustomerNavigate }: SiteHeaderProps) {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href="/" className="brand" onClick={onCustomerNavigate}>
          <span className="brand-mark"><Flower2 size={20} /></span>
          <span>mysa<span className="brand-house"> house</span><small>BEAUTY, AT YOUR OWN PACE</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/" onClick={onCustomerNavigate}>The studio</Link>
          <Link href="/services">Services</Link>
          <Link href={isLoggedIn ? "/my-bookings" : "/book" }onClick={onCustomerNavigate}>
          My bookings</Link>
        </nav>
        <div className="top-actions">
          {isLoggedIn ? (
            <>
              <div className="role-select">
                <span>Demo view</span>
                <select aria-label="Switch demo view" value={role} onChange={event => onRoleChange(event.target.value)} data-testid="select-demo-role">
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown size={14} />
              </div>
              <Link className="profile-icon-link" href="/profile" aria-label="Open profile" title="Profile">
                <UserRound size={19} />
              </Link>
              <Link className="notification-icon-link" href="/notifications" aria-label="Open notifications" title="Notifications">
                <Bell size={19} />
                {notificationCount > 0 && (
                  <span className="notification-count" aria-label={`${notificationCount} notifications`}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link className="btn account-nav-link" href="/login">Sign in</Link>
          )}
          {isLoggedIn && (
            <Link className="btn btn-sm top-book" href="/book" onClick={onCustomerNavigate}>
              Book a visit <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
