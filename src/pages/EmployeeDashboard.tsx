import { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from './config';

function EmployeeDashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('employeeToken'));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionPending, setActionPending] = useState<boolean>(false);

  // Helper to build auth headers
  const getAuthHeaders = useCallback(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  // Fetch current open attendance record for this employee
  const fetchAttendance = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/employee/attendance`, {
        headers: getAuthHeaders()
      });

      if (res.status === 401) {
        // token invalid/expired — clear and prompt login
        localStorage.removeItem('employeeToken');
        setToken(null);
        alert('Session expired. Please login again.');
        return;
      }

      const data = await res.json().catch(() => ({}));
      // backend returns { check_in: <iso> } or { check_in: null, open: false }
      if (data && data.check_in) {
        setCheckIn(new Date(data.check_in));
      } else {
        setCheckIn(null);
        setTimer(0);
      }
    } catch (err) {
      console.error('fetchAttendance error', err);
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders]);

  // Start/stop timer when checkIn changes
  useEffect(() => {
    if (!checkIn) {
      setTimer(0);
      return;
    }
    // set initial timer right away
    setTimer(Math.floor((Date.now() - checkIn.getTime()) / 1000));
    const interval = setInterval(() => {
      setTimer(Math.floor((Date.now() - checkIn.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [checkIn]);

  // Poll attendance periodically to keep in sync with backend (every 10s)
  useEffect(() => {
    if (!token) return;
    fetchAttendance();
    const poll = setInterval(() => fetchAttendance(), 10000);
    return () => clearInterval(poll);
  }, [token, fetchAttendance]);

  // Check in action
  const handleCheckIn = async () => {
    if (!token) {
      alert('No token found. Please login as employee.');
      return;
    }
    setActionPending(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/employee/checkin`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        localStorage.removeItem('employeeToken');
        setToken(null);
        alert('Session expired. Please login again.');
        return;
      }
      if (!res.ok) {
        alert(data?.message || 'Check-in failed');
        return;
      }
      if (data.check_in) {
        setCheckIn(new Date(data.check_in));
      } else {
        // fallback: refresh from server
        await fetchAttendance();
      }
    } catch (err) {
      console.error('checkin error', err);
      alert('Network error while checking in');
    } finally {
      setActionPending(false);
    }
  };

  // Check out action
  const handleCheckOut = async () => {
    if (!token) {
      alert('No token found. Please login as employee.');
      return;
    }
    setActionPending(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/employee/checkout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        localStorage.removeItem('employeeToken');
        setToken(null);
        alert('Session expired. Please login again.');
        return;
      }
      if (!res.ok) {
        alert(data?.message || 'Check-out failed');
        return;
      }
      // on success clear local checkin state
      setCheckIn(null);
      setTimer(0);
      // Optionally re-fetch to get latest attendance full record
      await fetchAttendance();
    } catch (err) {
      console.error('checkout error', err);
      alert('Network error while checking out');
    } finally {
      setActionPending(false);
    }
  };

  // If token changed externally, keep component state in sync
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('employeeToken'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Initial fetch when component mounts (if token present)
  useEffect(() => {
    if (token) fetchAttendance();
  }, [token, fetchAttendance]);

  // Optional: a tiny UI to clear token (logout)
  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    setToken(null);
    setCheckIn(null);
    setTimer(0);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Employee Dashboard</h2>

      {!token && (
        <div className="mb-4 text-red-600">
          No active session. Please log in as an employee to check in/out.
        </div>
      )}

      {loading && <div className="mb-4 text-gray-600">Checking status...</div>}

      {checkIn ? (
        <div>
          <p>Checked in at: {checkIn.toLocaleString()}</p>
          <p>
            Time elapsed: {Math.floor(timer / 3600)}h {Math.floor((timer % 3600) / 60)}m {timer % 60}s
          </p>
          <button
            onClick={handleCheckOut}
            disabled={actionPending || !token}
            className={`mt-4 px-4 py-2 rounded text-white ${actionPending ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {actionPending ? 'Processing...' : 'Check Out'}
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">You are currently not checked in.</p>
          <button
            onClick={handleCheckIn}
            disabled={actionPending || !token}
            className={`bg-green-500 text-white px-4 py-2 rounded ${actionPending ? 'opacity-60' : 'hover:bg-green-600'}`}
          >
            {actionPending ? 'Processing...' : 'Check In'}
          </button>
        </div>
      )}

      <div className="mt-6">
        <button onClick={handleLogout} className="text-sm text-gray-600 hover:underline">
          Logout (clear session)
        </button>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
