"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createEventDirectly } from "../../../actions/eventActions";

export default function CreateEvent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        
        // Call the Server Action directly
        const result = await createEventDirectly(formData);

        if (result.success) {
            alert("Event created and published successfully!");
            router.push("/dashboard/events");
        } else {
            alert("Error: " + result.error);
        }
        
        setLoading(false);
    };

    return (

        

        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Create New Event</h1>
                <p className="text-gray-500">Fill in the details to list your event on E-Grid.</p>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-300">
                <form onSubmit={handleSubmit} className="card-body gap-6">

                    {/* Title Section */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-bold">Event Title</span>
                        </label>
                        <input
                            name="title"
                            type="text"
                            placeholder="e.g. Dhaka Tech Summit 2026"
                            className="input input-bordered w-full focus:input-primary"
                            required
                        />
                    </div>

                    {/* Description Section */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-bold">Description</span>
                        </label>
                        <textarea
                            name="description"
                            className="textarea textarea-bordered h-32 focus:textarea-primary"
                            placeholder="Describe what your event is about..."
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Time Section */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold">Date & Time</span>
                            </label>
                            <input
                                name="time"
                                type="datetime-local"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                        </div>

                        {/* Location Section */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold">Location</span>
                            </label>
                            <input
                                name="location"
                                type="text"
                                placeholder="e.g. Bangabandhu International Conference Center"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Price Section */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold">Ticket Price (BDT)</span>
                            </label>
                            <div className="join w-full">
                                <span className="join-item btn btn-disabled bg-base-200">৳</span>
                                <input
                                    name="price"
                                    type="number"
                                    placeholder="0.00"
                                    className="input input-bordered join-item w-full focus:input-primary"
                                    required
                                />
                            </div>
                            <label className="label">
                                <span className="label-text-alt text-gray-400">Set to 0 for free events</span>
                            </label>
                        </div>

                        {/* Event Category (Added for your Search/Browse feature) */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold">Category</span>
                            </label>
                            <select
                                name="category"
                                className="select select-bordered w-full focus:select-primary"
                                defaultValue="default" // Set the default value here
                            >
                                <option value="default" disabled>Pick a category</option>
                                <option value="Technology">Technology</option>
                                <option value="Music">Music/Concert</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Sports">Sports</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Form Actions */}
                    <div className="card-actions justify-end">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn btn-primary px-8 ${loading ? "loading" : ""}`}
                        >
                            {loading ? "Publishing..." : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}