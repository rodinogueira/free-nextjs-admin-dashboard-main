import React from "react";
import { Service } from "@/lib/supabase";
import Badge from "../ui/badge/Badge";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {service.name}
        </h3>
        <Badge
          size="sm"
          color={service.type === "physical" ? "primary" : "success"}
        >
          {service.type === "physical" ? "Local Físico" : "Teleconsulta"}
        </Badge>
      </div>

      <div className="space-y-3">
        {service.type === "physical" && service.address && (
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-gray-500 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {service.address}
              </p>
              {service.city && service.state && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {service.city} - {service.state}
                </p>
              )}
            </div>
          </div>
        )}

        {service.type === "teleconsultation" && service.teleconsult_link && (
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <a
              href={service.teleconsult_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Link da Teleconsulta
            </a>
          </div>
        )}

        {service.phone && (
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {service.phone}
            </p>
          </div>
        )}

        {service.schedule && (
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {service.schedule}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
