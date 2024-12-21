import { API } from "../api"

export const handleInvalidateConfig = async()=>{
    const response = await API.deleteExiredConfigs()
    if(response.success){
        console.log(`Deleted clients: ${(response.data.chatIDs.length)?response.data.chatIDs:'0'}`);
        
    }else{
        console.log(`Error while invalidating: ${response.message}`)
    }
}