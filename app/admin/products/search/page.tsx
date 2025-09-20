import ProductSearchForm from "@/components/products/ProductSearchForm";
import ProductTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";

type SearchProps = {
  search: string
}

async function searchProducts(searchTerm: string) {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: 'insensitive'
      }
    },
    include: {
      category: true
    }
  })

  return products
}


export default async function SearchPage({searchParams} : { searchParams: Promise<SearchProps> }) {

  const searchParamsData = await searchParams
  const search = searchParamsData.search

  const products = await searchProducts(search)

  return (
    <>
      <Heading>Resultados de búsqueda: {search}</Heading>

      <div className="flex flex-col lg:flex-row lg:justify-end gap-5">
        <ProductSearchForm />
      </div>

      {products.length ? (
        <ProductTable 
          products={products}
        />
      ) : <p className="text-center text-lg">No hay resultados</p>}
    </>
  )
}
