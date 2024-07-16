export function modalOverlayClick(e:React.MouseEvent<HTMLDivElement, MouseEvent>, handler:React.Dispatch<React.SetStateAction<boolean>>){
    const element = e.target as HTMLDivElement
    if (element.id === 'modal-overlay'){
        handler(false);
    };
};