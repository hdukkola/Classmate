import { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Lock, User, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { loginToHAC, isLoggedIn, logoutFromHAC, getStudentInfo } from '../services/hacApi';

export function HACLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [districtUrl, setDistrictUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hacConnected, setHacConnected] = useState(isLoggedIn());
  const studentInfo = getStudentInfo();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await loginToHAC({ username, password, districtUrl });
      
      if (result.success) {
        setSuccess(`Connected as ${result.studentName}! 🎉`);
        setHacConnected(true);
        setUsername('');
        setPassword('');
        setDistrictUrl('');
      } else {
        setError(result.error || 'Failed to connect to HAC');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutFromHAC();
    setHacConnected(false);
    setSuccess('Disconnected from HAC');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (hacConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">HAC Connected</h3>
            <p className="text-sm text-white/60">Syncing your real grades</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center py-2 px-4 rounded-xl bg-white/5">
            <span className="text-sm text-white/60">Student Name</span>
            <span className="text-sm font-medium text-white">{studentInfo.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 px-4 rounded-xl bg-white/5">
            <span className="text-sm text-white/60">Status</span>
            <span className="text-sm font-medium text-green-400">● Active</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-medium transition-all"
        >
          Disconnect HAC
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Connect HAC PowerSchool</h3>
          <p className="text-sm text-white/60">Sync your real grades from any ISD</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            District URL
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="hac.friscoisd.org"
              value={districtUrl}
              onChange={(e) => setDistrictUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            />
          </div>
          <p className="mt-1 text-xs text-white/40">
            Example: hac.friscoisd.org (don't include https://)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            HAC Username
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Your HAC username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            HAC Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="password"
              placeholder="Your HAC password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/30"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-green-500/20 border border-green-500/30"
          >
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-300">{success}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Connecting...
            </span>
          ) : (
            'Connect HAC Account'
          )}
        </button>

        <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Your credentials are secure</p>
              <p className="text-blue-300/80 text-xs">
                We use encryption and never store your password. Your HAC login is only used to fetch your grades.
              </p>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
