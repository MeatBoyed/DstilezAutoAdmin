"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import LeadDialog from "./leadDialog";
import { LeadPaginationResponse, LeadWithCustomerAndVehicle } from "@/server/util/BusinessLogic";
import useSWR from "swr";
import { leadSearchParams } from "../page";
import { Lead } from "@prisma/client";
import Link from "next/link";
import { LinkIcon } from "lucide-react";

export interface OldLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  [key: string]: any;
}

export async function fetchVehicles(url: string) {
  return fetch(`${url}`, {
    method: "GET",
  }).then((res) => res.json());
}

export default function LeadTable({
  privacyMode,
  searchParams,
  data: { items, totalCount, totalPages },
}: {
  privacyMode?: boolean;
  searchParams: leadSearchParams;
  data: LeadPaginationResponse;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: string; order: string }>({ key: "name", order: "asc" });
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pagesize || "5");
  const [selectedLead, setSelectedLead] = useState<LeadWithCustomerAndVehicle | undefined>(undefined);

  const leads = useMemo<LeadWithCustomerAndVehicle[]>(() => {
    return items
      .filter((lead) => {
        const searchValue = search.toLowerCase();
        return (
          lead.Customer?.name.toLowerCase().includes(searchValue) ||
          lead.Customer?.email.toLowerCase().includes(searchValue) ||
          lead.Customer?.phoneNumber.toLowerCase().includes(searchValue) ||
          lead.stockId?.toString().toLowerCase().includes(searchValue) ||
          lead.status.toLowerCase().includes(searchValue)
        );
      })
      .sort((a: LeadWithCustomerAndVehicle, b: LeadWithCustomerAndVehicle) => {
        const valueA = a[sort.key as keyof Lead] ?? "";
        const valueB = b[sort.key as keyof Lead] ?? "";
        if (sort.order === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      })
      .slice((page - 1) * pageSize, page * pageSize);
  }, [items, search, sort, page, pageSize]);

  // const totalPages = Math.ceil(leads.length / pageSize);

  console.log("Leads: ", leads);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Leads</CardTitle>
        <CardDescription>View and manage your captured leads.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Search & Page size */}
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex items-center gap-2">
              <Label htmlFor="pageSize">Show</Label>
              <Select
                value={pageSize.toString()}
                defaultValue={pageSize.toString()}
                // onValueChange={(e) => setPageSize(parseInt(e))}
              >
                <SelectTrigger className="min-w-max">
                  <SelectValue defaultValue={pageSize.toString()} placeholder="Per page" className="focus:ring-0" />
                </SelectTrigger>
                <SelectContent className="w-full" align="end">
                  <SelectItem value="10">5</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() =>
                    setSort({
                      key: "name",
                      order: sort.key === "name" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                    })
                  }
                >
                  Name
                  {sort.key === "name" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                {!privacyMode && (
                  <TableHead
                    className="cursor-pointer"
                    onClick={() =>
                      setSort({
                        key: "email",
                        order: sort.key === "email" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                      })
                    }
                  >
                    Email
                    {sort.key === "email" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                  </TableHead>
                )}
                {!privacyMode && (
                  <TableHead
                    className="cursor-pointer"
                    onClick={() =>
                      setSort({
                        key: "phone",
                        order: sort.key === "phone" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                      })
                    }
                  >
                    Phone
                    {sort.key === "phone" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                  </TableHead>
                )}
                <TableHead
                  className="cursor-pointer"
                  onClick={() =>
                    setSort({
                      key: "company",
                      order: sort.key === "company" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                    })
                  }
                >
                  Vehicle
                  {sort.key === "company" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() =>
                    setSort({
                      key: "status",
                      order: sort.key === "status" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                    })
                  }
                >
                  Status
                  {sort.key === "status" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} onClick={() => setSelectedLead(lead)} className="cursor-pointer hover:bg-muted">
                  <TableCell>{lead.Customer?.name}</TableCell>
                  {!privacyMode && <TableCell>{lead.Customer?.email}</TableCell>}
                  {!privacyMode && <TableCell>{lead.Customer?.phoneNumber}</TableCell>}
                  <TableCell>
                    <Link
                      target="_blank"
                      href={`dstilezauto.co.za/view-car/${lead.stockId}`}
                      className="flex justify-center items-center gap-2"
                    >
                      {lead.stockId} <LinkIcon size={14} />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.status === "New" ? "outline" : lead.status === "Contacted" ? "secondary" : "default"}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Items per page & Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, leads.length)} of {leads.length} leads
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   setPage(Math.max(page - 1, 1));
                    // }}
                    // disabled={!!!(page === 1)}
                  />
                </PaginationItem>
                {Array.from({ length: 3 }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="/"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   setPage(p);
                      // }}
                      isActive={p === page}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   setPage(Math.min(page + 1, totalPages));
                    // }}
                    // disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
      {/* Lead Dialog */}
      {selectedLead && (
        <LeadDialog privacyMode={privacyMode} lead={selectedLead} onOpenChange={() => setSelectedLead(undefined)} />
      )}
    </Card>
  );
}
