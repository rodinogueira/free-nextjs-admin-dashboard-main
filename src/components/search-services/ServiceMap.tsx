"use client";

import React from "react";
import { Service } from "@/lib/supabase";

interface ServiceMapProps {
  services: Service[];
}

const ServiceMap: React.FC<ServiceMapProps> = ({ services }) => {
  const physicalServices = services.filter(
    (s) => s.type === "physical" && s.latitude && s.longitude
  );

  const centerLat = physicalServices.length > 0
    ? physicalServices.reduce((sum, s) => sum + (s.latitude || 0), 0) / physicalServices.length
    : -15.7801;

  const centerLon = physicalServices.length > 0
    ? physicalServices.reduce((sum, s) => sum + (s.longitude || 0), 0) / physicalServices.length
    : -47.9292;

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          Mapa de Serviços
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {physicalServices.length} locais físicos encontrados
        </p>
      </div>

      <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Mapa Interativo
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Centro: Lat {centerLat.toFixed(4)}, Lon {centerLon.toFixed(4)}
            </p>
            {physicalServices.length > 0 && (
              <div className="mt-4 space-y-2">
                {physicalServices.map((service) => (
                  <div
                    key={service.id}
                    className="text-xs text-gray-600 dark:text-gray-400"
                  >
                    📍 {service.name} - {service.city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          O mapa mostra a localização aproximada dos serviços físicos. Para integração completa, considere usar bibliotecas como Leaflet ou Google Maps.
        </p>
      </div>
    </div>
  );
};

export default ServiceMap;
