export default function useMultiFormatData(){

    const dataSource = [
        {
            key: '1',
            id: 1,
            createdAt: '2024-01-15',
            fullName: 'Juan Pérez',
            netkey: 'jperez01',
            type: 'Alta',
            status: 'Pendiente',
            tags: ['pendiente'],
        },
        {
            key: '2',
            id: 2,
            createdAt: '2024-01-18',
            fullName: 'María González',
            netkey: 'mgonza02',
            type: 'Modificación',
            status: 'Aprobado',
            tags: ['aprobado'],
        },
        {
            key: '3',
            id: 3,
            createdAt: '2024-01-20',
            fullName: 'Carlos Ramírez',
            netkey: 'cramir03',
            type: 'Baja',
            status: 'Rechazado',
            tags: ['rechazado'],
        },
        {
            key: '4',
            id: 4,
            createdAt: '2024-01-22',
            fullName: 'Ana López',
            netkey: 'alopez04',
            type: 'Alta',
            status: 'En revisión',
            tags: ['revision'],
        },
        {
            key: '5',
            id: 5,
            createdAt: '2024-01-25',
            fullName: 'Luis Martínez',
            netkey: 'lmarti05',
            type: 'Modificación',
            status: 'aprobado',
            tags: ['aprobado'],
        },
    ];

    return { dataSource };
}