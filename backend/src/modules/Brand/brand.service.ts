    import prisma from "../../config/prisma.ts";

    //create brand 
   export const createBrand = async (data: {name : string ;logo? : string }) => {
          return await prisma.brand.create({
            data: {
                name : data.name,
                logo : data.logo
            }
          })
   }


    //get all brands
   export const getAllBrands = async (query: {search?: string;page?: number;limit?: number;isActive?: boolean}) => {

          const {search, page = 1, limit = 10, isActive} = query;
          const where: any = {};
          return await prisma.brand.findMany()
   }

    //get brands by  id 
    export const getBrandById = async (id: number) => {
          return await prisma.brand.findUnique({
            where: {id},
          });
    }
     
    //update the brand 
    export const updateBrand = async (id: number, data: {name?: string; logo?: string; isActive?: boolean}) => {
        return await prisma.brand.update({
            where: {id},
            data,
        });
    }    

    //delete the brand 
    export const deleteBrand = async (id: number) => {
        return await prisma.brand.delete({
            where: {id}
        });
    }