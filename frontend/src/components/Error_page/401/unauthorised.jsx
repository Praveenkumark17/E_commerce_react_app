import React from 'react'
import Error_401 from './unauthorised.module.css'
import { Link } from 'react-router-dom'

export default function Unauthorised(){

    return(
        <>
        <div className="d-flex fs-1 fw-bold justify-content-center align-items-center flex-column" style={{height:'100vh'}}>
            <div className={Error_401.img}></div>
            <Link to={'/'} className="btn btn-primary">Back to home</Link>
        </div>
        </>
    )
}