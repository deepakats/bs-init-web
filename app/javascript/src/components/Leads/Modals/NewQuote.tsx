import React from "react";
import { useNavigate } from "react-router-dom";
import leadQuotes from "apis/lead-quotes";
import Toastr from "common/Toastr";
import { Formik, Form, Field } from "formik";
import { X } from "phosphor-react";
import * as Yup from "yup";

const newLeadSchema = Yup.object().shape({
  name: Yup.string().required("Name cannot be blank")
});

const initialValues = {
  name: "",
  description: "",
  price: 0.0
};

const NewQuote = ({ leadDetails, setnewLead, leadData, setLeadData }) => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    leadQuotes.create(leadDetails.id, {
      "name": values.name,
      "description": values.description,
      "status": "draft"
    })
      .then(res => {
        setLeadData([...leadData, { ...res.data }]);
        navigate(`/leads/${leadDetails.id}/quotes`)
        setnewLead(false);
        Toastr.success("Line item added successfully");
      });
  };

  return (
    <div className="px-4 flex items-center justify-center">
      <div
        className="overflow-auto fixed top-0 left-0 right-0 bottom-0 inset-0 z-10 flex items-start justify-center"
        style={{
          backgroundColor: "rgba(29, 26, 49, 0.6)"
        }}
      >
        <div className="relative px-4 h-full w-full md:flex md:items-center md:justify-center">
          <div className="rounded-lg px-6 pb-6 bg-white shadow-xl transform transition-all sm:align-middle sm:max-w-md modal-width">
            <div className="flex justify-between items-center mt-6">
              <h6 className="text-base font-extrabold">Add New Quote</h6>
              <button type="button" onClick={() => { setnewLead(false); }}>
                <X size={16} color="#CDD6DF" weight="bold" />
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={newLeadSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="form__label">Name</label>
                        <div className="tracking-wider block text-xs text-red-600">
                          {errors.name && touched.name &&
                            <div>{`${errors.name}`}</div>
                          }
                        </div>
                      </div>
                      <div className="mt-1">
                        <Field className={`form__input ${errors.name && touched.name && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="name" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="field">
                      <div className="field_with_errors">
                        <label className="form__label">Description</label>
                        <div className="tracking-wider block text-xs text-red-600">
                          {errors.description && touched.description &&
                            <div>{`${errors.description}`}</div>
                          }
                        </div>
                      </div>
                      <div className="mt-1">
                        <Field className={`form__input ${errors.description && touched.description && "border-red-600 focus:ring-red-600 focus:border-red-600"} `} name="description" />
                      </div>
                    </div>
                  </div>
                  <div className="actions mt-4">
                    <input
                      type="submit"
                      name="commit"
                      value="SAVE CHANGES"
                      className="form__input_submit"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewQuote;
