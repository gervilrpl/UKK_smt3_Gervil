'use client'
 
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
 
type ManagedUser = {
    id: number
    kodeUser: string | null
    fullname: string
    email: string
    role: string
    hasToken: boolean
    createdAt: string
}
 
const PAGE_SIZE = 10
 
export default function UserManagementPage() {
    const router = useRouter()
    const [users, setUsers] = useState<ManagedUser[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
 
    async function loadUsers(page = currentPage) {
        setIsLoading(true)
        setError("")
        try {
            const response = await fetch(`/api/users?page=${page}&pageSize=${PAGE_SIZE}`)
            const result = await response.json()
            if (!response.ok) throw new Error(result.error ?? "Gagal memuat user.")
            setUsers(result.users)
            setTotalUsers(result.pagination.totalUsers)
            setCurrentPage(result.pagination.page)
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Gagal memuat user.")
        } finally {
            setIsLoading(false)
        }
    }
 
    useEffect(() => {
        void loadUsers(1)
    }, [])
 
    function goToPage(page: number) {
        setCurrentPage(page)
        void loadUsers(page)
    }
 
    async function deleteUser(user: ManagedUser) {
        if (!window.confirm(`Hapus user ${user.fullname}?`)) return
        setError("")
        try {
            const response = await fetch(`/api/users/${user.id}`, { method: "DELETE" })
            const result = await response.json()
            if (!response.ok) throw new Error(result.error ?? "Gagal menghapus user.")
            if (users.length === 1 && currentPage > 1) {
                goToPage(currentPage - 1)
            } else {
                await loadUsers(currentPage)
            }
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus user.")
        }
    }
 
    const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE))
 
    return (
        <Card className="m-6 px-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="mb-1 text-2xl font-bold">User</h1>
                    <p className="text-sm text-muted-foreground">Kelola facility.</p>
                </div>
                <Button onClick={() => router.push("/admin/user-management/form/add")}>
                    <Plus aria-hidden="true" />
                    Tambah biasa
                </Button>
            </div>
 
            {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
 
            <div className="mt-5 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nama Unit</TableHead>
                            <TableHead>Nama </TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>JWT</TableHead>
                            <TableHead>Dibuat</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={7} className="text-center">Memuat user...</TableCell></TableRow>
                        ) : users.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center">Belum ada user.</TableCell></TableRow>
                        ) : users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.kodeUser ?? "-"}</TableCell>
                                <TableCell className="font-medium">{user.fullname}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="capitalize">{user.role}</TableCell>
                                <TableCell>{user.hasToken ? "Tersimpan" : "Belum ada"}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString("id-ID")}</TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            aria-label={`Edit ${user.fullname}`}
                                            title="Edit user"
                                            onClick={() => router.push(`/admin/user-management/form/${user.id}`)}
                                        >
                                            <Pencil aria-hidden="true" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            aria-label={`Hapus ${user.fullname}`}
                                            title="Hapus user"
                                            onClick={() => void deleteUser(user)}
                                        >
                                            <Trash2 aria-hidden="true" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
 
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <nav aria-label="Pagination">
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        {getPageItems(currentPage, totalPages).map((item, index) => (
                            item === "ellipsis" ? (
                                <span key={`ellipsis-${index}`} className="px-2" aria-hidden="true">…</span>
                            ) : (
                                <Button
                                    key={item}
                                    type="button"
                                    variant={item === currentPage ? "default" : "ghost"}
                                    aria-label={`Go to page ${item}`}
                                    aria-current={item === currentPage ? "page" : undefined}
                                    disabled={isLoading || item === currentPage}
                                    onClick={() => goToPage(item)}
                                >
                                    {item}
                                </Button>
                            )
                        ))}
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={currentPage === totalPages || isLoading}
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </nav>
            </div>
        </Card>
    )
}
 
function getPageItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
    if (totalPages <= 4) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }
    if (currentPage <= 2) return [1, 2, 3, "ellipsis"]
    if (currentPage >= totalPages - 1) {
        return ["ellipsis", totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis"]
}
