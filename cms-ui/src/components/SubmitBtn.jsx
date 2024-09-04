import { Formik } from "formik"
import { Button } from "react-bootstrap"

export const SubmitBtn = ({variant="dark", disabled=false, icon='fa-save', label='Save'})=>{
    return <Button 
    type="submit"
     variant={variant}
     disabled={disabled} >
    <i className={`fa-solid ${disabled ? 'fa-spin fa-spinner' : icon} me-2`}></i> {label}</Button>
}