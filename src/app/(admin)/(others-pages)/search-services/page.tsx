"use client";

import React, { useEffect, useState } from "react";
import { supabase, Service } from "@/lib/supabase";
import SearchBar from "@/components/search-services/SearchBar";
import ServiceTypeFilter from "@/components/search-services/ServiceTypeFilter";
import StateFilter from "@/components/search-services/StateFilter";
import ServiceCard from "@/components/search-services/ServiceCard";
import ServiceMap from "@/components/search-services/ServiceMap";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export default function SearchServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, searchQuery, selectedType, selectedStates]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) throw error;

      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...services];

    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((service) => service.type === selectedType);
    }

    if (selectedStates.length > 0) {
      filtered = filtered.filter((service) =>
        selectedStates.includes(service.state)
      );
    }

    setFilteredServices(filtered);
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Buscar Serviços" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] space-y-6 sticky top-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Filtros
              </h2>
              <ServiceTypeFilter
                selectedType={selectedType}
                onChange={setSelectedType}
              />
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <StateFilter
                selectedStates={selectedStates}
                onChange={setSelectedStates}
              />
            </div>

            {(selectedType !== "all" || selectedStates.length > 0) && (
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSelectedStates([]);
                }}
                className="w-full text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                Buscar Serviços de Saúde
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Encontre serviços de saúde próximos a você
              </p>
            </div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por nome, cidade ou endereço..."
            />
          </div>

          <ServiceMap services={filteredServices} />

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Resultados da Busca
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {loading
                  ? "Carregando..."
                  : `${filteredServices.length} serviço(s) encontrado(s)`}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">
                  Nenhum serviço encontrado
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
