import React from 'react';
import { User, GraduationCap, Calendar, ChevronRight } from 'lucide-react';

const MyChildren = () => {
    const children = [
        {
            id: 1,
            name: 'Jean Dupont',
            grade: '6ème A',
            birthDate: '12/05/2012',
            gender: 'Masculin',
            avatar: 'https://i.pravatar.cc/150?u=jean'
        },
        {
            id: 2,
            name: 'Marie Dupont',
            grade: 'CM2',
            birthDate: '08/11/2014',
            gender: 'Féminin',
            avatar: 'https://i.pravatar.cc/150?u=marie'
        },
    ];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">My Children</h1>
                <p className="text-white/40 mt-1">Manage and view details for all your children enrolled in SchoolHub.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children.map((child) => (
                    <div key={child.id} className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-start justify-between group hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex gap-6">
                            <img src={child.avatar} alt={child.name} className="w-20 h-20 rounded-2xl ring-4 ring-white/5 object-cover" />
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white">{child.name}</h3>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-white/60 text-sm">
                                        <GraduationCap size={16} />
                                        <span>Grade: {child.grade}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/60 text-sm">
                                        <Calendar size={16} />
                                        <span>Born: {child.birthDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/60 text-sm">
                                        <User size={16} />
                                        <span>Gender: {child.gender}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 rounded-full bg-white/5 text-white/20 group-hover:text-[#eb8e3a] group-hover:bg-[#eb8e3a]/10 transition-all">
                            <ChevronRight size={24} />
                        </div>
                    </div>
                ))}

                {/* Add Child Placeholder */}
                <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#eb8e3a]/40 hover:bg-[#eb8e3a]/5 transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#eb8e3a] transition-all">
                        <User size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Enroll Another Child</h4>
                        <p className="text-sm text-white/40">Start a new registration process.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyChildren;
