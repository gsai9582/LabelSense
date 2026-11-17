import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth, UserRole, DEMO_PERSONAS } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, KeyRound, Building2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { role: currentRole, switchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

  const roles: {
    role: UserRole;
    persona: typeof DEMO_PERSONAS[UserRole];
    badge: 'teal' | 'pass' | 'default';
    description: string;
    permissions: string[];
  }[] = [
    {
      role: 'Reviewer',
      persona: DEMO_PERSONAS['Reviewer'],
      badge: 'teal',
      description: 'Regulatory affairs analyst focused on dossier reviews, symbol verification, and clause traceability.',
      permissions: ['Read-only audits', 'Clause RAG viewer', 'Visual redline analysis', 'Dossier export'],
    },
    {
      role: 'QA Lead',
      persona: DEMO_PERSONAS['QA Lead'],
      badge: 'pass',
      description: 'Lead Quality Engineer authorized to execute validation pipelines and sign electronic signoffs.',
      permissions: ['Full verification pipeline', 'Electronic signoff authorization', 'Batch compare approval', 'Audit appending'],
    },
    {
      role: 'Admin',
      persona: DEMO_PERSONAS['Admin'],
      badge: 'default',
      description: 'QMS Director with governance rights over audit logs, system parameters, and rule extraction.',
      permissions: ['Hash chain integrity checks', 'Rule dictionary editing', 'Security log audit', 'All QA permissions'],
    },
  ];

  const handleApplyLogin = () => {
    switchRole(selectedRole);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="lg">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <DialogTitle>Access Authentication & Persona Switcher</DialogTitle>
        </div>
        <DialogDescription>
          Select an authorized clinical role to simulate role-based authorization and cryptographic signature privileges.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-3" role="radiogroup" aria-label="Select role persona">
        {roles.map(item => {
          const isSelected = selectedRole === item.role;
          return (
            <div
              key={item.role}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setSelectedRole(item.role)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRole(item.role);
                }
              }}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/40 dark:border-teal-500 dark:bg-teal-950/30 ring-1 ring-teal-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 dark:border-teal-400 dark:bg-teal-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-slate-900" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {item.persona.name}
                      </span>
                      <Badge variant={item.badge}>{item.role}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="h-3 w-3" />
                      {item.persona.department}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-2xs text-slate-400 dark:text-slate-500">
                  {item.persona.id}
                </span>
              </div>

              <p className="text-2xs text-slate-600 dark:text-slate-400 mt-2 pl-6.5 leading-normal">
                {item.description}
              </p>

              <div className="mt-2.5 pl-6.5 flex flex-wrap gap-1.5">
                {item.permissions.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-2xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono"
                  >
                    <ShieldCheck className="h-2.5 w-2.5 text-teal-600 dark:text-teal-400" />
                    {p}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={handleApplyLogin}>
          <UserCheck className="h-3.5 w-3.5 mr-1" />
          Authenticate as {selectedRole}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
