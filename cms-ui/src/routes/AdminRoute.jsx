import { Loading } from "@/components"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


export const AdminRoute = ({element})=>{
    const user = useSelector(state=>state.user.value)

    const navigate = useNavigate()

    useEffect(() => {
        if(user.role != "Admin"){
          navigate('/')
        }
    }
    , [user])

    return user ?  element : <Loading/>
}