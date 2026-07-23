"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Shield,
  Key,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    date_of_joined: "",
    tempory_psw: "",
    status: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "",
            address: data.address || "",
            date_of_joined: data.date_of_joined || "",
            tempory_psw: data.tempory_psw || "",
            status: data.status || "Active",
          });
        }
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error loading user profile::", err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMessage("");
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          gender: formData.gender,
          address: formData.address,
          tempory_psw: formData.tempory_psw,
        })
        .eq("auth_id", user.id);

      if (error) throw error;
      setSuccessMessage("Profile settings updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      const err = error as Error;
      console.error("Error updating profile: ", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 text-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Account Settings
            </h1>
            <p className="text-sm text-slate-400">
              Manage your company profile details and security configurations.
            </p>
          </div>
          {successMessage && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Main Form Container */}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Card: Personal Information */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" /> Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-slate-200"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/30 border border-slate-800/50 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-slate-200"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-slate-200"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Address
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3 pointer-events-none text-slate-500">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <textarea
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-slate-200 resize-none"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Account & System Data (Read-only metadata) */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" /> System Metadata
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Date Joined
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={formData.date_of_joined || "N/A"}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/30 border border-slate-800/50 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Account Status
                </label>
                <input
                  type="text"
                  value={formData.status}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-950/30 border border-slate-800/50 rounded-xl text-sm text-emerald-400 font-medium cursor-not-allowed uppercase tracking-wide"
                />
              </div>
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
