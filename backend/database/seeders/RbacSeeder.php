<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RbacSeeder extends Seeder
{
    /**
     * Seed the roles, permissions, and role-permission assignments.
     */
    public function run(): void
    {
        $roles = [
            'farmer' => ['name' => 'Farmer', 'description' => 'Registered farmer with access to farm tools and market data.'],
            'agriculture_officer' => ['name' => 'Agriculture Officer', 'description' => 'Government agriculture extension officer.'],
            'researcher' => ['name' => 'Researcher', 'description' => 'Research personnel with read/export access to data.'],
            'admin' => ['name' => 'Admin', 'description' => 'Platform administrator with full system access.'],
        ];

        $permissions = [
            'dashboard.view' => ['name' => 'View Dashboard', 'module' => 'dashboard'],
            'crops.view' => ['name' => 'View Crops', 'module' => 'crops'],
            'weather.view' => ['name' => 'View Weather', 'module' => 'weather'],
            'soil.view' => ['name' => 'View Soil Data', 'module' => 'soil'],
            'disease.view' => ['name' => 'View Diseases', 'module' => 'diseases'],
            'market.view' => ['name' => 'View Market Prices', 'module' => 'market'],
            'schemes.view' => ['name' => 'View Schemes', 'module' => 'schemes'],
            'schemes.apply' => ['name' => 'Apply to Schemes', 'module' => 'schemes'],
            'equipment.view' => ['name' => 'View Equipment', 'module' => 'equipment'],
            'equipment.book' => ['name' => 'Book Equipment', 'module' => 'equipment'],
            'coldstorage.view' => ['name' => 'View Cold Storage', 'module' => 'coldstorage'],
            'coldstorage.book' => ['name' => 'Book Cold Storage', 'module' => 'coldstorage'],
            'transport.view' => ['name' => 'View Transport', 'module' => 'transport'],
            'transport.calculate' => ['name' => 'Calculate Transport', 'module' => 'transport'],
            'reports.view' => ['name' => 'View Reports', 'module' => 'reports'],
            'reports.export' => ['name' => 'Export Reports', 'module' => 'reports'],
            'notifications.manage' => ['name' => 'Manage Notifications', 'module' => 'notifications'],
            'users.manage' => ['name' => 'Manage Users', 'module' => 'users'],
            'content.manage' => ['name' => 'Manage Content', 'module' => 'content'],
            'system.manage' => ['name' => 'Manage System', 'module' => 'system'],
        ];

        $assignments = [
            'farmer' => [
                'dashboard.view', 'crops.view', 'weather.view', 'soil.view', 'disease.view',
                'market.view', 'schemes.view', 'schemes.apply', 'equipment.view', 'equipment.book',
                'coldstorage.view', 'coldstorage.book', 'transport.view', 'transport.calculate',
                'reports.view', 'notifications.manage',
            ],
            'agriculture_officer' => [
                'dashboard.view', 'crops.view', 'weather.view', 'soil.view', 'disease.view',
                'market.view', 'schemes.view', 'schemes.apply', 'equipment.view', 'equipment.book',
                'coldstorage.view', 'coldstorage.book', 'transport.view', 'transport.calculate',
                'reports.view', 'reports.export', 'notifications.manage', 'content.manage',
            ],
            'researcher' => [
                'dashboard.view', 'crops.view', 'weather.view', 'soil.view', 'disease.view',
                'market.view', 'reports.view', 'reports.export',
            ],
            'admin' => array_keys($permissions),
        ];

        $roleModels = [];
        foreach ($roles as $code => $data) {
            $roleModels[$code] = Role::firstOrCreate(['code' => $code], [
                'name' => $data['name'],
                'description' => $data['description'],
                'is_system' => true,
            ]);
        }

        $permissionModels = [];
        foreach ($permissions as $code => $data) {
            $permissionModels[$code] = Permission::firstOrCreate(['code' => $code], [
                'name' => $data['name'],
                'module' => $data['module'],
            ]);
        }

        foreach ($assignments as $roleCode => $permissionCodes) {
            $role = $roleModels[$roleCode];
            $role->permissions()->sync(
                collect($permissionCodes)->map(fn (string $code) => $permissionModels[$code]->id)->all(),
            );
        }
    }
}
