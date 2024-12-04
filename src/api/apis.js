import { createApi, deleteData, getAll, editData } from './api_helper';

export const createService = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};
export const createOutOfService = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const editServices = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};
export const editSmsTemplate = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const editInAndEx = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};
export const editUser = async (com_url,payload)=>{
  const response = await editData(com_url,payload)
  return response
}
export const editPackage = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};
export const editBooking = async (com_url , payload) =>{
  const response = await editData(com_url , payload)
  return response
}
export const editEmployee = async (com_url,payload)=>{
  const response = await editData(com_url,payload)
  return response
}

export const createVehicleType = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};
export const createEmployee = async (com_url,payload)=>{
  const response = await createApi(com_url,payload)
  return response

}


export const createTemplate = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};
export const allVehicleType = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};
export const allSmsTemplate = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};
export const allEmployee = async (com_url)=>{
  const response = await getAll(com_url)
  return response;
}

export const allService = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const createInAndEx = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};
export const createPackage = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const createBooking = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const allInAndEx = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};
export const allBooking = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};
export const allPackage = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const allUser = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const deleteService = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};
export const deletePackage = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const deleteVehicleType = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};
export const deleteInAndEx = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const allOutOfServices = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const deleteOutOfService = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};
