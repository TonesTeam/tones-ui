import { SelectListProp } from "common/components";
import { GroupBase, Options } from "react-select";
import { LiquidDTO } from "sharedlib/dto/liquid.dto";

export function getFilteredLiquidList (liquids: LiquidDTO[], categoryID: number){
    return liquids.filter((l) => l.categoryId == categoryID)
    // .map((liq) => ({
    //     label: liq.name,
    //     value: liq.id,
    //   }));
    
    // let res = {
    //     label: "liquids",
    //     options: 
    // }
}

export function getCategoriesList(liquids: LiquidDTO[]){
    let distincts = liquids.filter(
        (liq_1, index) => liquids.findIndex((liq_2) => liq_2.categoryId === liq_1.categoryId) === index
    )
    .filter((categ) => categ.categoryId != 2) //exclude washing

    let toList = distincts.map((categ) => ({
      label: categ.categoryName,
      value: categ.categoryId,
    }));



    return toList
}


export function getCategoryIDByLiquid(liquids: LiquidDTO[], id: number){
    let liquidDTO = liquids.find((liq)=> liq.id==id)   
    console.log("Utils found this liquid object: ", liquidDTO) 
    return liquidDTO ? liquidDTO.categoryId : 1
}




