import * as React from "react";
import { MarketPriceItem } from "../../types/market";
import { formatINR } from "../../utils/currency";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { SearchBar } from "../forms/search-bar";
import { FilterBar } from "../forms/filter-bar";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface MarketPriceTableProps {
  items: MarketPriceItem[];
  onSelectCrop?: (item: MarketPriceItem) => void;
}

export function MarketPriceTable({ items, onSelectCrop }: MarketPriceTableProps) {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");

  const categories = [
    { label: "All Categories", value: "All" },
    { label: "Cereals", value: "Cereals" },
    { label: "Vegetables", value: "Vegetables" },
    { label: "Oilseeds", value: "Oilseeds" },
  ];

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.cropName.toLowerCase().includes(search.toLowerCase()) ||
      item.mandiName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">APMC Mandi Price Intelligence</h3>
          <p className="text-xs text-slate-500">Live commodity prices and price trend variations</p>
        </div>
        <div className="w-full md:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search crop or mandi..." />
        </div>
      </div>

      <FilterBar options={categories} selected={categoryFilter} onChange={setCategoryFilter} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Crop Name</TableHead>
            <TableHead>Mandi & Location</TableHead>
            <TableHead>Today's Price</TableHead>
            <TableHead>24h Trend</TableHead>
            <TableHead>Weekly Range</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((item) => {
            const isUp = item.changePercentage > 0;
            const isDown = item.changePercentage < 0;
            return (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => onSelectCrop && onSelectCrop(item)}>
                <TableCell className="font-bold text-slate-900">{item.cropName}</TableCell>
                <TableCell>
                  <span className="font-semibold text-slate-800">{item.mandiName}</span>
                  <span className="block text-xs text-slate-400">{item.state}</span>
                </TableCell>
                <TableCell className="font-black text-slate-900 text-base">{formatINR(item.todaysPrice)} / Qtl</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      isUp ? "bg-emerald-50 text-emerald-700" : isDown ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : isDown ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                    {isUp ? `+${item.changePercentage}%` : `${item.changePercentage}%`}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-600 font-medium">
                  {formatINR(item.minPrice)} - {formatINR(item.maxPrice)}
                </TableCell>
                <TableCell className="text-xs text-slate-400">{item.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => onSelectCrop && onSelectCrop(item)}
                    className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    View Chart
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
