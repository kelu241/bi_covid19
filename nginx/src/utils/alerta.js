import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


export function showConfirm(message, onConfirm) {
  confirmAlert({
    title: 'Confirmação',
    message,
    buttons: [
      {
        label: 'Sim',
        onClick: onConfirm
      },
      {
        label: 'Não'
        // onClick: () => {} // opcional
      }
    ]
  });
}