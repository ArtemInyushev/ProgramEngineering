import React from 'react';
import { useField } from 'formik';
import cn from 'classnames';

export const FormInput = ({ label, id, ...props }) => {
    const [field, meta] = useField(props.field, props.form);

    return (
        <>
            <label className="form-label" htmlFor={id}>{label}</label>
            <input className={cn("form-control", ((meta.touched && meta.error) || props.form.errors.error) && "form-danger")} {...field} {...props} />
            {meta.touched && meta.error && <div className="text-danger">{meta.error}</div>}
        </>
    );
};