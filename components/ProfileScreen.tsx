import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Button } from './ui/Button';
import { ArrowLeft, Save, Edit2, Shield, Star, Trophy, Check, Camera, Upload, Image as ImageIcon } from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  onBack: () => void;
  onUpdate: (updatedProfile: UserProfile) => void;
}

// Curated list for Diversity & Inclusion (Avataaars Style)
const AVATARS = [
  // 1. Menino, Pele Clara, Cabelo Curto
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&mouth=smile&eyebrows=default&skinColor=f8d25c&top=shortFlat",
  // 2. Menina, Pele Clara, Cabelo Longo
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lottie&mouth=smile&eyebrows=default&skinColor=ffdbb4&top=longHairStraight",
  // 3. Menino, Pele Negra, Cabelo Curto
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb&mouth=smile&eyebrows=default&skinColor=ae5d29&top=shortCurly",
  // 4. Menina, Pele Negra, Cabelo Afro/Volumoso
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Amara&mouth=smile&eyebrows=default&skinColor=614335&top=bigHair",
  // 5. Menino, Traços Asiáticos/Indígenas
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Hiro&mouth=smile&eyebrows=default&skinColor=edb98a&top=shortWaved",
  // 6. Menina, Inclusão (Hijab/Lenço)
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&mouth=smile&eyebrows=default&top=hijab&accessoriesProbability=0&skinColor=d08b5b",
  // 7. Menino, Óculos, Pele Morena
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah&mouth=smile&eyebrows=default&accessories=glasses&skinColor=d08b5b&top=shortDreads",
  // 8. Menina, Cabelo Colorido/Moderno
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jade&mouth=smile&eyebrows=default&top=bob&hairColor=f59797&skinColor=ffdbb4"
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation: Check if it is an image
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
      }

      // Limit size to 5MB to prevent performance issues with base64 strings
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem é muito grande. Escolha uma menor que 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
    <div className="container mx-auto px-4 py-8 max-w-2xl pb-24">
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
                <button 
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                  title="Alterar Foto"
                >
                  <Camera size={18} />
                </button>
              )}
            </div>

            <div className="text-center sm:text-left flex-1 w-full sm:w-auto">
              {isEditing ? (
                <div className="mb-2 w-full">
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
             <div className={`mb-8 p-4 rounded-xl border border-dashed
                ${isTeen ? 'bg-slate-900/50 border-slate-600' : 'bg-gray-50/50 border-gray-300'}
             `}>
               <div className="flex justify-between items-center mb-4">
                  <p className={`text-sm font-bold ${isTeen ? 'text-gray-300' : 'text-gray-600'}`}>Escolha um Avatar:</p>
                  
                  {/* Hidden Input for File Upload */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  
                  <button 
                    onClick={triggerFileInput}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
                       ${isTeen ? 'bg-slate-700 text-teen-accent hover:bg-slate-600' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'}
                    `}
                  >
                     <Upload size={14} /> Enviar Foto
                  </button>
               </div>
               
               <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                 {/* Preset Avatars */}
                 {AVATARS.map((avatar, i) => (
                   <button 
                    key={i} 
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative rounded-full p-1 border-2 transition-all hover:scale-110 aspect-square
                        ${selectedAvatar === avatar ? 'border-green-500 scale-110 ring-2 ring-green-200' : 'border-transparent'}
                    `}
                   >
                     <img src={avatar} alt="hero option" className="w-full h-full rounded-full bg-slate-50 object-cover" />
                     {selectedAvatar === avatar && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-[2px]">
                          <Check size={10} strokeWidth={4} />
                        </div>
                     )}
                   </button>
                 ))}

                 {/* Custom Upload Preview Slot (if selected avatar is NOT in presets) */}
                 {!AVATARS.includes(selectedAvatar) && (
                    <button 
                      onClick={triggerFileInput}
                      className="relative rounded-full p-1 border-2 border-green-500 scale-110 ring-2 ring-green-200 aspect-square overflow-hidden"
                    >
                       <img src={selectedAvatar} alt="custom upload" className="w-full h-full rounded-full object-cover" />
                       <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-[2px]">
                          <Check size={10} strokeWidth={4} />
                       </div>
                    </button>
                 )}
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