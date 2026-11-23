import { NextResponse } from "next/server"
import { Prisma } from "@/src/generated/prisma/client"
import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createUserJwt, hashUserPassword } from "@/lib/user-security"

const facilityFields = {
  kodeFacility: true,
  nama: true,
  createdAt: true,
  updatedAt: true,
} as const

// PEMBUATAN AUTO NUMBER 
async function generateKodeFacility(tx: Prisma.TransactionClient, role: string) {
  const prefix = "FCT"

  const lastFacility = await tx.facility.findFirst({
    where: {
      kodeFacility: { startsWith: prefix },
    },
    orderBy: {
      kodeFacility: "desc",
    },
    select: { kodeFacility: true },
  })

  if (!lastFacility || !lastFacility.kodeFacility) {
    return `${prefix}0000001`
  }

  const numericPart = lastFacility.kodeFacility.slice(prefix.length)
  const lastNumber = Number.parseInt(numericPart, 10)
  const nextNumber = Number.isNaN(lastNumber) ? 1 : lastNumber + 1

  return `${prefix}${String(nextNumber).padStart(7, "0")}`
}


export async function GET(request: Request) {
  if (!await getAuthenticatedUser()) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  const searchParams = new URL(request.url).searchParams
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10)
  const requestedPageSize = Number.parseInt(searchParams.get("pageSize") ?? "10", 10)
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.min(100, Math.max(1, requestedPageSize))
    : 10

  try {
    const totalFacility = await prisma.facility.count()
    const totalPages = Math.max(1, Math.ceil(totalFacility / pageSize))
    const page = Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1

    const facility = await prisma.facility.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: facilityFields,
    })

    return NextResponse.json({
      items:   facility,
      pagination: { page, pageSize, totalFacility, totalPages },
    })
  } catch (error) {
    console.error("Failed to fetch facility:", error)
    return NextResponse.json({ error: "Gagal memuat data facility." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!await getAuthenticatedUser()) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Format request tidak valid." }, { status: 400 })
  }

  const nama = typeof body.nama === "string" ? body.nama.trim() : ""


  if (!nama) {
    return NextResponse.json({ error: "Nama facility wajib diisi." }, { status: 400 })
  }

  

  try {

      const facility = await prisma.$transaction(async (transaction) => {
  // Kirim transaction DAN role ke dalam fungsi
  const kodeFacility = await generateKodeFacility(transaction)

  const created = await transaction.facility.create({
    data: { kodeFacility, nama },
  })

      return transaction.facility.update({
        data: { kodeFacility, nama, },
        select: facilityFields,
      })
    })


    return NextResponse.json({
          user: { ...safeUser, hasToken: Boolean(token) },
        }, { status: 201 })
      } catch (error) {
        if (isDuplicateEmail(error)) {
          return NextResponse.json({ error: "Email sudah digunakan." }, { status: 409 })
        }
    
        console.error("Failed to create user:", error)
    
        return NextResponse.json(
          { error: "Gagal membuat user. Periksa koneksi database." },
          { status: 500 }
    )
  }
}