import Swal from 'sweetalert2';

const swalBase = Swal.mixin({
  heightAuto: false,
  backdrop: true,
  allowOutsideClick: false,
  didOpen: (el) => {
    const container = el.closest('.swal2-container');
    if (container) {
      container.style.zIndex = '20000';
    }
  },
});

const useSwal = () => {
  /**
   * Displays a success alert using SweetAlert2.
   *
   * @function
   * @param {string|Object} options - Either a string for the title or an object with options.
   * @param {string} [options.title] - The title of the success alert.
   * @param {string} [options.text] - The plain text content of the alert.
   * @param {string} [options.html] - Optional HTML content for the alert body.
   * @param {boolean} [options.showConfirmButton=true] - Whether to show the confirm button. Defaults to `true`.
   *
   * @example
   * success('Operation completed successfully');
   *
   * @example
   * success({ title: 'Data saved!', text: 'Everything was inserted', showConfirmButton: false });
   */
  const success = (options, showConfirmButton = true) => {
    if (typeof options === 'string') {
      return swalBase.fire({
        icon: 'success',
        title: options,
        showConfirmButton,
      });
    }
    return swalBase.fire({
      icon: 'success',
      title: options.title ?? '',
      text: options.text ?? '',
      html: options.html ?? '',
      showConfirmButton: options.showConfirmButton ?? true,
    });
  };

  /**
   * Displays an error alert using SweetAlert2.
   *
   * @function
   * @param {Object} options - Configuration options for the alert.
   * @param {string} [options.title] - The title of the alert.
   * @param {string} [options.text] - The plain text content of the alert.
   * @param {string} [options.html] - Optional HTML content for the alert body.
   * @param {boolean} [options.showConfirmButton=true] - Whether to show the confirm button.
   * @param {boolean} [options.showCancelButton=false] - Whether to show the cancel button.
   * @param {string} [options.confirmButtonText='Aceptar'] - Text for the confirm button.
   * @param {string} [options.cancelButtonText=''] - Text for the cancel button.
   *
   * @example
   * error({
   *   title: 'Something went wrong',
   *   text: 'An unexpected error occurred.',
   *   showConfirmButton: true,
   *   confirmButtonText: 'Retry'
   * });
   */
  const error = (options) => {
    if (typeof options === 'string') {
      return swalBase.fire({
        icon: 'error',
        title: 'Error',
        text: options,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }

    return swalBase.fire({
      title: options.title ?? 'Error',
      text: options.text ?? '',
      icon: 'error',
      html: options.html ?? '',
      showConfirmButton: options.showConfirmButton ?? true,
      showCancelButton: options.showCancelButton ?? false,
      confirmButtonText: options.confirmButtonText ?? 'Aceptar',
      cancelButtonText: options.cancelButtonText ?? '',
    });
  };

  /**
   * Displays a warning confirmation dialog using SweetAlert2.
   *
   * Returns a Promise that resolves with `true` if the user confirms, or `false` otherwise.
   *
   * @function
   * @param {Object} [options={}] - Optional configuration for the warning dialog.
   * @param {string} [options.title=''] - Title of the dialog.
   * @param {string} [options.text=''] - Plain text message shown in the dialog.
   * @param {string} [options.icon='warning'] - Icon type for the dialog (e.g., 'warning', 'question').
   * @param {string} [options.confirmButtonColor='#f9c54e'] - Hex color for the confirm button.
   * @param {string} [options.confirmButtonText='Aceptar'] - Text for the confirm button.
   *
   * @returns {Promise<boolean>} Resolves to `true` if the user confirms, otherwise `false`.
   *
   * @example
   * warning({
   *   title: 'Are you sure?',
   *   text: 'You won\'t be able to revert this!',
   *   confirmButtonText: 'Yes, delete it!',
   * }).then((confirmed) => {
   *   if (confirmed) {
   *     // proceed with action
   *   }
   * });
   */
  const warning = (options = {}) => {
    return new Promise((resolve, reject) => {
      swalBase
        .fire({
          title: options.title ?? '',
          text: options.text ?? '',
          html: options.html ?? '',
          icon: options.icon ?? 'warning',
          showCancelButton: true,
          confirmButtonColor: options.confirmButtonColor ?? '#f9c54e',
          cancelButtonColor: '#74788d',
          cancelButtonText: 'Cancelar',
          confirmButtonText: options.confirmButtonText ?? 'Aceptar',
          customClass: {
            confirmButton: 'text-dark',
          },
        })
        .then((result) => {
          resolve(result.isConfirmed);
        })
        .catch((error) => reject(error));
    });
  };

  /**
   * Displays an info alert using SweetAlert2.
   *
   * @function
   * @param {string|Object} options - Either a string for the title or an object with options.
   * @param {string} [options.title] - The title of the info alert.
   * @param {string} [options.text] - The plain text content of the alert.
   * @param {string} [options.html] - Optional HTML content for the alert body.
   * @param {boolean} [options.showConfirmButton=true] - Whether to show the confirm button.
   *
   * @example
   * info('Some items already exist');
   *
   * @example
   * info({ title: 'Notice', text: 'These items are duplicates', showConfirmButton: false });
   */
  const info = (options) => {
    if (typeof options === 'string') {
      return swalBase.fire({
        title: options,
        icon: 'info',
        showConfirmButton: true,
      });
    }
    return swalBase.fire({
      title: options.title ?? '',
      text: options.text ?? '',
      icon: 'info',
      html: options.html ?? '',
      showConfirmButton: options.showConfirmButton ?? true,
    });
  };

  /**
   * Displays a toast notification using SweetAlert2.
   *
   * @function
   * @param {string} message - The main message/title displayed in the toast.
   * @param {Object} [options={}] - Optional configuration for the toast.
   * @param {string} [options.position='top-end'] - Position of the toast on screen (e.g., 'top-end', 'bottom-start').
   * @param {boolean} [options.showConfirmButton=false] - Whether to show a confirm button.
   * @param {number} [options.timer=3000] - Duration in milliseconds before the toast disappears.
   * @param {boolean} [options.timerProgressBar=true] - Whether to show a timer progress bar.
   * @param {string} [options.icon='success'] - The icon to display (e.g., 'success', 'error', 'warning', 'info', 'question').
   *
   * @example
   * toast('Saved successfully!');
   *
   * @example
   * toast('Something went wrong', {
   *   icon: 'error',
   *   position: 'bottom-start',
   *   timer: 5000,
   *   showConfirmButton: true
   * });
   */
  const toast = (message, options = {}) => {
    const Toast = Swal.mixin({
      toast: true,
      position: options.position ?? 'top-end',
      showConfirmButton: options.showConfirmButton ?? false,
      timer: options.timer ?? 3000,
      timerProgressBar: options.timerProgressBar ?? true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
        const container = toast.closest('.swal2-container');
        if (container) {
          container.style.zIndex = '20000';
        }
      },
    });

    Toast.fire({
      icon: options.icon ?? 'success',
      title: message,
    });
  };

  const confirm = async (options) => {
    return await swalBase
      .fire({
        title: options.title ?? '',
        text: options.text ?? '',
        icon: options.icon ?? 'warning',
        showCancelButton: options.showCancelButton ?? true,
        confirmButtonColor: options.confirmButtonColor ?? '#3085d6',
        cancelButtonColor: options.cancelButtonColor ?? '#d33',
        cancelButtonText: options.cancelButtonColor ?? 'Cancelar',
        confirmButtonText: options.confirmButtonText ?? 'Aceptar',
      })
      .then((result) => result.isConfirmed);
  };

  /**
   * Expose the raw fire method for custom configurations.
   */
  const fire = (options) => {
    return swalBase.fire(options);
  };

  return {
    success,
    error,
    warning,
    info,
    toast,
    confirm,
    fire,
  };
};

export default useSwal;
