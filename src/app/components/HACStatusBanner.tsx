import { motion } from 'motion/react';
import { AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { isLoggedIn } from '../services/hacApi';
import { useNavigate } from 'react-router';

export function HACStatusBanner() {
  const hacConnected = isLoggedIn();
  const navigate = useNavigate();

  if (hacConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 mt-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-300">HAC Connected</p>
            <p className="text-xs text-green-400/80">Showing your real grades from PowerSchool</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-5 mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-xl cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => navigate('/settings')}
    >
      <div className="flex items-center gap-3">
        <GraduationCap className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-300">Using Demo Data</p>
          <p className="text-xs text-blue-400/80">Tap to connect your HAC account for real grades</p>
        </div>
        <AlertCircle className="w-4 h-4 text-blue-400/60" />
      </div>
    </motion.div>
  );
}
