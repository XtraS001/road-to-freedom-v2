"use client";
import Container from "@/components/container";
import httpClient from "@/lib/httpClient";
import { PagedResponse } from "@/models/http/PagedResponse";
import { UserResponse } from "@/models/user/UserResponse";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";
import useSWR from "swr";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function page() {
  const [page, setPage] = React.useState(1);

  const { data } = useSWR(`/api/admin/users?page=${page}`, () => {
    return httpClient
      .get<PagedResponse<UserResponse>>("/api/admin/users", {
        params: { page: page - 1 },
      })
      .then((res) => res.data);
  });

  return (
    <Container size="xl">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>First name</TableHead>
              <TableHead>Last name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Impersonate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <a href={`/api/auth/impersonate?username=${user.email}`}>
                    <Button variant="outline" size="sm">Impersonate</Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {!data?.data ||
              (data.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No users
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {data && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm font-medium">
            Page {page} of {data.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Container>
  );
}
