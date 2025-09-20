import ProductSearchForm from "@/components/products/ProductSearchForm";
import ProductsPagination from "@/components/products/ProductsPagination";
import ProductTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function productCount() {
  return await prisma.product.count()
}

async function getProducts(page: number, pageSize: number) {

  const skip = (page - 1) * pageSize

  const produtcs = await prisma.product.findMany({
    take: pageSize,
    skip: skip,
    include: {
      category: true
    }
  })

  return produtcs
}

type PageProps = {
  page: string
}

export type ProductsWithCategory = Awaited<ReturnType<typeof getProducts>>  // Inferir a partir de una función (recomendada si el query puede cambiar)

export default async function ProductsPage({searchParams} : { searchParams: Promise<PageProps> }) {

  const searchParamsData = await searchParams

  const page = +searchParamsData.page || 1
  const pageSize = 10

  if(page < 0) redirect('/admin/products')

  const productsData = getProducts(page, pageSize)
  const totalProductsData = productCount()
  const [ products, totalProducts ] = await Promise.all([productsData, totalProductsData]) // Hace que sean PARALELAS y no dependa una de otra (independientes)

  const totalPages = Math.ceil(totalProducts / pageSize) // Redondeamos hacia arriba

  if(page > totalPages) redirect('/admin/products')

  return (
    <>
      <Heading>Administrar Productos</Heading>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
        <Link
          href={'/admin/products/new'}
          className="bg-amber-400 w-full lg:w-auto text-xl px-10 py-3 text-center font-bold cursor-pointer"
        >Crear Producto</Link>

        <ProductSearchForm />
      </div>

      <ProductTable 
        products={products}
      />

      <ProductsPagination
        page={page}
        totalPages={totalPages}
      />
    </>
  )
}
