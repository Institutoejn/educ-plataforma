import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './ui/Button';
import { ArrowLeft, Save, Edit2, Shield, Star, Trophy, Check } from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  onBack: () => void;
  onUpdate: (updatedProfile: UserProfile) => void;
}

// Consistent Superhero Avatars (Adventurer Style)
const AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Captain",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zack",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=SuperNova",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Easton",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Liliana"
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

  const handleSave = () => {
    if (name.trim()) {
      onUpdate({
        ...user,
        name: name,
        avatar: selectedAvatar
      });
      setIsEditing(false);
    }
  };

  // Visual Theme Helpers
  const isTeen = user.ageGroup === '12-14';
  const isKid = user.ageGroup === '6-8';

  const getCardStyle = () => {
    if (isTeen) return 'bg-slate-800 border border-slate-700 shadow-[0_0_30px_rgba(6,182,212,0.1)]';
    if (isKid) return 'bg-white border-4 border-yellow-400 shadow-xl rounded-3xl';
    return 'bg-white shadow-lg rounded-2xl'; // 9-11
  };

  const getProgressColor = () => {
    if (isTeen) return 'bg-teen-accent';
    if (isKid) return 'bg-yellow-400';
    return 'bg-educ-secondary';
  };

  // XP Progress Calculation (Assuming 100 XP per level based on App.tsx logic)
  const xpForNextLevel = 100;
  const currentLevelProgress = user.xp % xpForNextLevel;
  const progressPercentage = (currentLevelProgress / xpForNextLevel) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <Button variant="secondary" onClick={onBack} ageGroup={user.ageGroup}>
          <ArrowLeft size={20} className="mr-2" /> Voltar
        </Button>
        <h1 className={`text-2xl font-bold uppercase tracking-wider ${isTeen ? 'text-white' : 'text-gray-800'}`}>
          {isKid ? 'Minha Carteirinha' : isTeen ? 'Dados do Agente' : 'Passaporte de Herói'}
        </h1>
        <div className="w-10" />
      </div>

      <div className={`${getCardStyle()} p-6 sm:p-10 relative overflow-hidden transition-all duration-300`}>
        {/* Background Lore Decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield size={150} />
        </div>

        <div className="relative z-10">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="relative group">
              <img 
                src={isEditing ? selectedAvatar : user.avatar} 
                alt="Profile" 
                className={`w-32 h-32 rounded-full border-4 shadow-md bg-gray-100 object-cover
                  ${isTeen ? 'border-teen-accent' : isKid ? 'border-yellow-400' : 'border-white'}
                `} 
              />
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                  <Edit2 size={16} />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              {isEditing ? (
                <div className="mb-2">
                  <label className={`block text-xs uppercase font-bold mb-1 ${isTeen ? 'text-gray-400' : 'text-gray-500'}`}>Nome de Herói</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xl font-bold p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                    placeholder="Seu nome"
                  />
                </div>
              ) : (
                <h2 className={`text-3xl font-bold mb-1 ${isTeen ? 'text-white' : 'text-gray-800'}`}>
                  {user.name}
                </h2>
              )}
              
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                  ${isTeen ? 'bg-slate-700 text-teen-accent' : 'bg-gray-100 text-gray-600'}
                `}>
                  Nível {user.level}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                  ${isTeen ? 'bg-slate-700 text-purple-400' : 'bg-gray-100 text-gray-600'}
                `}>
                  {user.ageGroup} Anos
                </span>
              </div>
            </div>

            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="secondary" ageGroup={user.ageGroup} className="!px-4 !py-2">
                <Edit2 size={16} className="mr-2" /> Editar
              </Button>
            ) : (
              <Button onClick={handleSave} variant="primary" ageGroup={user.ageGroup} className="!px-4 !py-2">
                <Save size={16} className="mr-2" /> Salvar
              </Button>
            )}
          </div>

          {/* Avatar Selection (Only in Edit Mode) */}
          {isEditing && (
             <div className="mb-8 p-4 bg-gray-50/10 rounded-xl border border-dashed border-gray-300">
               <p className={`text-sm mb-3 font-bold ${isTeen ? 'text-gray-300' : 'text-gray-600'}`}>Trocar Super-Herói:</p>
               <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                 {AVATARS.map((avatar, i) => (
                   <button 
                    key={i} 
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative rounded-full p-1 border-2 transition-all hover:scale-110 ${selectedAvatar === avatar ? 'border-green-500 scale-110' : 'border-transparent'}`}
                   >
                     <img src={avatar} alt="hero option" className="w-full h-full rounded-full bg-indigo-50" />
                     {selectedAvatar === avatar && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-[2px]">
                          <Check size={8} strokeWidth={4} />
                        </div>
                     )}
                   </button>
                 ))}
               </div>
             </div>
          )}

          {/* Stats Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className={`text-sm font-bold uppercase ${isTeen ? 'text-gray-400' : 'text-gray-500'}`}>
                Progresso para Nível {user.level + 1}
              </span>
              <span className={`text-sm font-bold ${isTeen ? 'text-teen-accent' : 'text-educ-primary'}`}>
                {currentLevelProgress} / {xpForNextLevel} XP
              </span>
            </div>
            <div className={`w-full h-4 rounded-full ${isTeen ? 'bg-slate-700' : 'bg-gray-200'} overflow-hidden`}>
              <div 
                className={`h-full transition-all duration-1000 ${getProgressColor()}`} 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Badges Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className={isTeen ? 'text-yellow-500' : 'text-yellow-600'} />
              <h3 className={`text-lg font-bold ${isTeen ? 'text-white' : 'text-gray-800'}`}>
                Minhas Conquistas
              </h3>
            </div>

            {user.badges.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {user.badges.map((badge, idx) => (
                  <div key={idx} className="aspect-square bg-yellow-100 rounded-lg flex items-center justify-center border-2 border-yellow-300">
                     <span className="text-2xl">🏅</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-6 rounded-xl text-center border-2 border-dashed
                ${isTeen ? 'border-slate-600 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}
              `}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mb-2">
                  <Star className="text-gray-400" />
                </div>
                <p className={`text-sm ${isTeen ? 'text-gray-400' : 'text-gray-500'}`}>
                  Complete missões para ganhar medalhas!
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};