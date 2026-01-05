"use client";

import { Mail, Phone, MapPin, User } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  image?: string | null;
  email?: string | null;
  phone?: string | null;
};

type Props = {
  members: TeamMember[];
};

export default function TeamSection({ members }: Props) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Meet Our Team
          </h2>
          <p className="text-gray-600">
            Experienced professionals dedicated to making your journey
            unforgettable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Photo */}
              <div className="aspect-square bg-gray-100">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                    <User className="w-20 h-20 text-white/70" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {member.name}
                </h3>
                <p className="text-forest-700 text-sm mb-3">{member.role}</p>

                {member.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                )}

                {/* Contact */}
                <div className="space-y-2 text-sm">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-forest-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-forest-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
