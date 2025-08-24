export class DialogService {
	static readonly DIALOG_TYPES = {
		DEFAULT: 'default',
		DANGER: 'danger',
	} as const;

	static readonly DEFAULT_TEXTS = {
		CONFIRM: 'Підтвердити',
		CANCEL: 'Скасувати',
		DELETE: 'Видалити',
	};

	static createDeleteConfirmationConfig(itemName: string) {
		return {
			title: 'Підтвердження видалення',
			message: `Ви впевнені, що хочете видалити локацію "${itemName}"? Цю дію не можна буде скасувати.`,
			confirmText: DialogService.DEFAULT_TEXTS.DELETE,
			cancelText: DialogService.DEFAULT_TEXTS.CANCEL,
			type: DialogService.DIALOG_TYPES.DANGER as 'danger',
		};
	}
}
