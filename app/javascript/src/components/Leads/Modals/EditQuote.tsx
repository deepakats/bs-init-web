import React, { useState } from "react";

import leadQuotes from "apis/lead-quotes";
import { Formik, Form, Field } from "formik";
import { X } from "phosphor-react";
import * as Yup from "yup";

const newItemSchema = Yup.object().shape({
  name: Yup.string().required("Name cannot be blank"),
});

const getInitialvalues = (item) => ({
  name: item.name,
  description: item.description,
  price: item.price
});

export interface IProps {
  setShowEditDialog: any;
  leadDetails: any;
  item: any;
}

const EditQuote = ({ leadDetails, item, setShowEditDialog }: IProps) => {

  const [apiError, setApiError] = useState<string>("");

  const handleSubmit = async values => {
    await leadQuotes.update(leadDetails.id, item.id, {
      "name": values.name,
      "description": values.description,
    }).then(() => {
      setShowEditDialog(false);
      document.location.reload();
    }).catch((e) => {
      setApiError(e.message);
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
              <h6 className="text-base font-extrabold">Edit Line Item</h6>
              <button type="button" onClick={() => { setShowEditDialog(false); }}>
                <X size={16} color="#CDD6DF" weight="bold" />
              </button>
            </div>
            <Formik
              initialValues={getInitialvalues(item)}
              validationSchema={newItemSchema}
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
                  <p className="tracking-wider mt-3 block text-xs text-red-600">{apiError}</p>
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

export default EditQuote;
