import React, { useState, useRef, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import CameraIcon from './icons/CameraIcon';
import type { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userProfile, onSave, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setProfile(userProfile);
      setImagePreview(null);
    }
  }, [isOpen, userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      profilePic: imagePreview || profile.profilePic,
    };
    onSave(updatedProfile);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-auto transform transition-transform duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 relative">
          <h2 className="text-lg font-bold text-slate-800 text-center">Profile Settings</h2>
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSaveChanges} className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={imagePreview || profile.profilePic} 
                alt="Profile" 
                className="w-28 h-28 rounded-full object-cover shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-2 hover:bg-rose-600 transition-colors"
                aria-label="Change profile picture"
              >
                <CameraIcon />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfilePicChange} />
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" name="name" id="name" value={profile.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
              <input type="tel" name="phone" id="phone" value={profile.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" readOnly disabled />
            </div>
             <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-slate-700">UPI ID</label>
              <input type="text" name="upiId" id="upiId" value={profile.upiId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" />
            </div>
          </div>
          
          <div className="mt-8 pt-5 border-t border-slate-200 flex justify-between items-center">
            <button 
                type="button" 
                onClick={onLogout} 
                className="text-sm font-medium text-red-600 hover:text-red-800"
            >
                Logout
            </button>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                Cancel
              </button>
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;