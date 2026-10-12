const fs = require('fs');
let c = fs.readFileSync('src/components/VillageDossierModal.tsx', 'utf8');

if (!c.includes('framer-motion')) {
  c = c.replace(
    'import React, { useState, useEffect } from \\'react\\';',
    'import React, { useState, useEffect } from \\'react\\';\\nimport { motion, AnimatePresence } from \\'framer-motion\\';'
  );
  
  // Replace imports if it used a different import signature
  if (!c.includes('framer-motion')) {
      c = c.replace('import React,', 'import { motion, AnimatePresence } from \\'framer-motion\\';\\nimport React,');
  }
  
  // Replace outermost div
  c = c.replace(
    '<div\\n      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"\\n      onClick={onClose}\\n      style={{ animation: \\'fadeIn 0.3s ease-out\\' }}\\n    >',
    '<motion.div\\n      initial={{ opacity: 0 }}\\n      animate={{ opacity: 1 }}\\n      exit={{ opacity: 0 }}\\n      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"\\n      onClick={onClose}\\n    >'
  );

  c = c.replace(
    '<div\\n      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"\\n      onClick={onClose}\\n    >',
    '<motion.div\\n      initial={{ opacity: 0 }}\\n      animate={{ opacity: 1 }}\\n      exit={{ opacity: 0 }}\\n      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"\\n      onClick={onClose}\\n    >'
  );
  
  // Replace modal container
  c = c.replace(
    '<div\\n        className="relative w-full max-w-5xl max-h-[90vh] bg-[#f9f5f0] rounded-3xl shadow-2xl overflow-hidden flex flex-col"\\n        onClick={(e) => e.stopPropagation()}\\n        dir="rtl"\\n        style={{ animation: \\'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)\\' }}\\n      >',
    '<motion.div\\n        initial={{ y: 50, scale: 0.95, opacity: 0 }}\\n        animate={{ y: 0, scale: 1, opacity: 1 }}\\n        exit={{ y: 20, scale: 0.95, opacity: 0 }}\\n        transition={{ type: \\'spring\\', damping: 25, stiffness: 300 }}\\n        className="relative w-full max-w-5xl max-h-[90vh] bg-[#f9f5f0] rounded-3xl shadow-2xl overflow-hidden flex flex-col"\\n        onClick={(e) => e.stopPropagation()}\\n        dir="rtl"\\n      >'
  );

  c = c.replace(
    '<div\\n        className="relative w-full max-w-5xl max-h-[90vh] bg-[#f9f5f0] rounded-3xl shadow-2xl overflow-hidden flex flex-col"\\n        onClick={(e) => e.stopPropagation()}\\n        dir="rtl"\\n      >',
    '<motion.div\\n        initial={{ y: 50, scale: 0.95, opacity: 0 }}\\n        animate={{ y: 0, scale: 1, opacity: 1 }}\\n        exit={{ y: 20, scale: 0.95, opacity: 0 }}\\n        transition={{ type: \\'spring\\', damping: 25, stiffness: 300 }}\\n        className="relative w-full max-w-5xl max-h-[90vh] bg-[#f9f5f0] rounded-3xl shadow-2xl overflow-hidden flex flex-col"\\n        onClick={(e) => e.stopPropagation()}\\n        dir="rtl"\\n      >'
  );
  
  // Close tags
  const lines = c.split('\\n');
  let replaced = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('</div>')) {
      lines[i] = lines[i].replace('</div>', '</motion.div>');
      replaced++;
      if (replaced === 2) break;
    }
  }
  c = lines.join('\\n');
  
  // Add content-visibility class to body
  c = c.replace('<div className="flex-1 overflow-y-auto p-6 space-y-6">', '<div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ contentVisibility: \\'auto\\' }}>');
  
  fs.writeFileSync('src/components/VillageDossierModal.tsx', c, 'utf8');
}
