import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Bell, UserRound } from 'lucide-react';
import { Route, Switch, useLocation } from 'wouter';
import { SiteFooter } from './components/layout/SiteFooter';
import { SiteHeader } from './components/layout/SiteHeader';
import { FloatingAssistant } from './pages/FloatingAssistant';
import { NotFound } from './components/ui/Shared';
import { initialDemoData } from './data/demoData';
import { AdminPage } from './pages/AdminPage';
import { AccountForm } from './components/forms/AccountForm';
import { BookingForm } from './components/forms/BookingForm';
import { HomePage } from './pages/HomePage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ServicesPage } from './pages/ServicesPage';
import { StaffPage } from './pages/StaffPage';
import type { DemoData, UserProfile } from './types';
import './index.css';
import './styles/components.css';

function App() {
  // This demo starts with sample data each time the page is refreshed.
  const [data, setData] = useState<DemoData>(initialDemoData);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('customer');
  const [currentPath, setPath] = useLocation();
  const isAdminPage = currentPath === '/admin';

  // Update part of the app data without replacing the other parts.
  function updateDemoData(changes: Partial<DemoData>) {
    setData(currentData => ({ ...currentData, ...changes }));
  }

  // Look up a service or team member by their ID.
  function findService(serviceId: string) {
    return data.services.find(service => service.id === serviceId);
  }

  function findStaffMember(staffId: string) {
    return data.staff.find(person => person.id === staffId);
  }

  // The role selector is a demo shortcut to the customer, staff, and admin pages.
  function changeRole(nextRole: string) {
    setRole(nextRole);

    if (nextRole === 'customer') {
      setPath('/');
      return;
    }

    setPath(`/${nextRole}`);
  }

  function showCustomerView() {
    setRole('customer');
  }

  return (
    <div className="grain min-h-screen">
      {!isAdminPage && (
        <SiteHeader
          role={role}
          isLoggedIn={isLoggedIn}
          notificationCount={isLoggedIn
            ? data.bookings.filter(booking =>
              booking.email.toLowerCase() === profile.email.toLowerCase()
              && booking.status !== 'cancelled'
              && booking.date >= new Date().toISOString().slice(0, 10),
            ).length
            : 0}
          onRoleChange={changeRole}
          onCustomerNavigate={showCustomerView}
        />
      )}

      <Switch>
        <Route path="/">
          <HomePage services={data.services} brands={data.brands} reviews={data.reviews} serviceById={findService} />
        </Route>

        <Route path="/services">
        {isLoggedIn ? (
          <ServicesPage services={data.services} />
        ) : (
         <main className="account-access wrap page-in">
              <section className="account-card card">
                <h1 className="serif">Sign in to Know About The Service.</h1>
                <p className="account-intro">Please sign in before choosing your service and appointment time.</p>
                <Link className="btn" href="/login">Sign in to continue <ArrowRight size={16} /></Link>
              </section>
            </main>
            )}
        </Route>

        <Route path="/login">
          <AccountForm
            mode="login"
            onAuthenticated={authenticatedProfile => {
              setProfile(authenticatedProfile);
              setIsLoggedIn(true);
              setPath('/');
            }}
          />
        </Route>

        <Route path="/signup">
          <AccountForm
            mode="signup"
            onAuthenticated={authenticatedProfile => {
              setProfile(authenticatedProfile);
              setIsLoggedIn(true);
              setPath('/');
            }}
          />
        </Route>

        <Route path="/profile">
          {isLoggedIn ? (
            <ProfilePage
              profile={profile}
              onSave={setProfile}
              bookings={data.bookings}
              reviews={data.reviews}
              onAddReview={review => updateDemoData({ reviews: [review, ...data.reviews] })}
              serviceById={findService}
              onLogout={() => {
                setIsLoggedIn(false);
                setProfile({ name: '', email: '', phone: '' });
                setPath('/');
              }}
            />
          ) : (
            <main className="account-access wrap page-in">
              <section className="account-card card">
                <div className="account-brand-mark"><UserRound size={22} /></div>
                <h1 className="serif">Sign in to view your profile.</h1>
                <p className="account-intro">Your profile details are available after you sign in.</p>
                <Link className="btn" href="/login">Sign in <ArrowRight size={16} /></Link>
              </section>
            </main>
          )}
        </Route>

        <Route path="/notifications">
          {isLoggedIn ? (
            <NotificationsPage bookings={data.bookings} profile={profile} />
          ) : (
            <main className="account-access wrap page-in">
              <section className="account-card card">
                <div className="account-brand-mark"><Bell size={22} /></div>
                <h1 className="serif">Sign in to view notifications.</h1>
                <p className="account-intro">Your appointment updates are available after you sign in.</p>
                <Link className="btn" href="/login">Sign in <ArrowRight size={16} /></Link>
              </section>
            </main>
          )}
        </Route>

        <Route path="/book">
          {isLoggedIn ? (
            <BookingForm
              services={data.services}
              staff={data.staff}
              bookings={data.bookings}
              save={bookings => updateDemoData({ bookings })}
            />
          ) : (
            <main className="account-access wrap page-in">
              <section className="account-card card">
                <h1 className="serif">Sign in to book a visit.</h1>
                <p className="account-intro">Please sign in before choosing your service and appointment time.</p>
                <Link className="btn" href="/login">Sign in to continue <ArrowRight size={16} /></Link>
              </section>
            </main>
          )}
        </Route>

        <Route path="/my-bookings">
          <MyBookingsPage
            data={data}
            serviceById={findService}
            staffById={findStaffMember}
            update={bookings => updateDemoData({ bookings })}
            reviews={data.reviews}
            updateReviews={reviews => updateDemoData({ reviews })}
            services={data.services}
            staff={data.staff}
          />
        </Route>

        <Route path="/staff">
          {isLoggedIn ? (
            <StaffPage
              data={data}
              serviceById={findService}
              staffById={findStaffMember}
              update={bookings => updateDemoData({ bookings })}
            />
          ) : (
            <main className="account-access wrap page-in">
              <section className="account-card card">
                <div className="account-brand-mark"><UserRound size={22} /></div>
                <h1 className="serif">Sign in to view the staff schedule.</h1>
                <p className="account-intro">Create an account or sign in to continue to the studio schedule.</p>
                <Link className="btn" href="/signup">Create an account <ArrowRight size={16} /></Link>
                <p className="account-switch">Already have an account? <Link href="/login">Sign in</Link></p>
              </section>
            </main>
          )}
        </Route>

        <Route path="/admin">
          <AdminPage
            data={data}
            patch={updateDemoData}
            serviceById={findService}
            staffById={findStaffMember}
          />
        </Route>

        <Route>
          <NotFound onBack={() => setPath('/')} />
        </Route>
      </Switch>

      {!isAdminPage && <SiteFooter />}
      {!isAdminPage && <FloatingAssistant />}
    </div>
  );
}

export default App;
