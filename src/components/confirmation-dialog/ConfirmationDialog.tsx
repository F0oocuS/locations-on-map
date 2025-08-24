import React from 'react';
import { ConfirmationDialogProps } from '../../core/interfaces/props/ConfirmationDialogProps';
import './ConfirmationDialog.scss';

function ConfirmationDialog({
	isOpen,
	title,
	message,
	confirmText = 'Підтвердити',
	cancelText = 'Скасувати',
	onConfirm,
	onCancel,
	type = 'default'
}: ConfirmationDialogProps): React.ReactElement | null {
	if (!isOpen) return null;

	return (
		<div className="confirmation-dialog">
			<div className="confirmation-dialog__overlay" onClick={onCancel}></div>
			<div className="confirmation-dialog__content">
				<div className="confirmation-dialog__header">
					<h3 className="confirmation-dialog__title">{title}</h3>
				</div>
				
				<div className="confirmation-dialog__body">
					<p className="confirmation-dialog__message">{message}</p>
				</div>
				
				<div className="confirmation-dialog__actions">
					<button 
						className="confirmation-dialog__btn confirmation-dialog__btn--cancel"
						onClick={onCancel}
					>
						{cancelText}
					</button>
					<button 
						className={`confirmation-dialog__btn confirmation-dialog__btn--confirm ${
							type === 'danger' ? 'confirmation-dialog__btn--danger' : ''
						}`}
						onClick={onConfirm}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmationDialog;