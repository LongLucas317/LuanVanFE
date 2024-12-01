import Swal from "sweetalert2";

const success = (mess = "Success") => {
  Swal.fire({
    text: mess,
    icon: "success",
    timer: 2000,
  });
};

const error = (mess = "Error") => {
  Swal.fire({
    icon: "error",
    text: mess,
    timer: 2000,
  });
};

const toastSuccess = (mess = "Success") => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "success",
    title: mess,
  });
};

const toastError = (mess = "Error") => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "error",
    title: mess,
  });
};

const notificationSuccess = (mess = "Success") => {
  Swal.fire({
    text: mess,
    icon: "success",
    timer: 1000,
    showConfirmButton: false,
  });
};

const notificationError = (mess = "Success") => {
  Swal.fire({
    text: mess,
    icon: "success",
    timer: 1000,
    showConfirmButton: false,
  });
};

export {
  success,
  error,
  toastSuccess,
  toastError,
  notificationSuccess,
  notificationError,
};
