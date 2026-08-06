<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use HasUuids;
    use Notifiable;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'full_name',
        'phone',
        'email',
        'phone_verified_at',
        'email_verified_at',
        'password_hash',
        'avatar_url',
        'preferred_language',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'phone_verified_at' => 'datetime',
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    /**
     * The columns that should receive a UUID (the primary key stays BIGINT).
     *
     * @return list<string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function getAuthPassword(): ?string
    {
        return $this->password_hash;
    }

    public function isActive(): bool
    {
        return (bool) $this->is_active;
    }

    public function isVerified(): bool
    {
        return $this->phone_verified_at !== null || $this->email_verified_at !== null;
    }

    public function hasRole(string $code): bool
    {
        return $this->roles()->where('code', $code)->exists();
    }

    public function hasAnyRole(array $codes): bool
    {
        return $this->roles()->whereIn('code', $codes)->exists();
    }

    public function hasPermission(string $code): bool
    {
        return $this->roles()
            ->whereHas('permissions', fn ($query) => $query->where('permissions.code', $code))
            ->exists();
    }

    /**
     * @return HasOne<FarmerProfile, $this>
     */
    public function farmerProfile(): HasOne
    {
        return $this->hasOne(FarmerProfile::class, 'user_id');
    }

    /**
     * @return HasOne<NotificationSetting, $this>
     */
    public function notificationSetting(): HasOne
    {
        return $this->hasOne(NotificationSetting::class, 'user_id');
    }

    /**
     * @return HasOne<ThemeSetting, $this>
     */
    public function themeSetting(): HasOne
    {
        return $this->hasOne(ThemeSetting::class, 'user_id');
    }

    /**
     * @return BelongsToMany<Role, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_role', 'user_id', 'role_id')
            ->withTimestamps();
    }

    /**
     * @return HasMany<OtpCode, $this>
     */
    public function otps(): HasMany
    {
        return $this->hasMany(OtpCode::class, 'user_id');
    }

    /**
     * @return HasMany<FarmerField, $this>
     */
    public function farmerFields(): HasMany
    {
        return $this->hasMany(FarmerField::class, 'user_id');
    }

    /**
     * @return HasMany<FarmerCrop, $this>
     */
    public function farmerCrops(): HasMany
    {
        return $this->hasMany(FarmerCrop::class, 'user_id');
    }

    /**
     * @return HasMany<FarmerDocument, $this>
     */
    public function farmerDocuments(): HasMany
    {
        return $this->hasMany(FarmerDocument::class, 'user_id');
    }

    /**
     * @return HasMany<Harvest, $this>
     */
    public function harvests(): HasMany
    {
        return $this->hasMany(Harvest::class, 'user_id');
    }

    /**
     * @return HasMany<CropRecommendation, $this>
     */
    public function cropRecommendations(): HasMany
    {
        return $this->hasMany(CropRecommendation::class, 'user_id');
    }

    /**
     * @return HasMany<AiAdvisory, $this>
     */
    public function aiAdvisories(): HasMany
    {
        return $this->hasMany(AiAdvisory::class, 'user_id');
    }

    /**
     * @return HasMany<SoilTest, $this>
     */
    public function soilTests(): HasMany
    {
        return $this->hasMany(SoilTest::class, 'user_id');
    }

    /**
     * @return HasMany<WeatherAlert, $this>
     */
    public function issuedWeatherAlerts(): HasMany
    {
        return $this->hasMany(WeatherAlert::class, 'issued_by');
    }

    /**
     * @return HasMany<DiseaseDetection, $this>
     */
    public function diseaseDetections(): HasMany
    {
        return $this->hasMany(DiseaseDetection::class, 'user_id');
    }

    /**
     * @return HasMany<DiseaseHistory, $this>
     */
    public function diseaseHistories(): HasMany
    {
        return $this->hasMany(DiseaseHistory::class, 'user_id');
    }

    /**
     * @return HasMany<SchemeApplication, $this>
     */
    public function schemeApplications(): HasMany
    {
        return $this->hasMany(SchemeApplication::class, 'user_id');
    }

    /**
     * @return HasMany<Equipment, $this>
     */
    public function equipmentListings(): HasMany
    {
        return $this->hasMany(Equipment::class, 'provider_id');
    }

    /**
     * @return HasMany<EquipmentBooking, $this>
     */
    public function rentalBookings(): HasMany
    {
        return $this->hasMany(EquipmentBooking::class, 'user_id');
    }

    /**
     * @return HasMany<ColdStorage, $this>
     */
    public function coldStorages(): HasMany
    {
        return $this->hasMany(ColdStorage::class, 'owner_id');
    }

    /**
     * @return HasMany<ColdStorageBooking, $this>
     */
    public function storageBookings(): HasMany
    {
        return $this->hasMany(ColdStorageBooking::class, 'user_id');
    }

    /**
     * @return HasMany<TransportCalculation, $this>
     */
    public function transportCalculations(): HasMany
    {
        return $this->hasMany(TransportCalculation::class, 'user_id');
    }

    /**
     * @return HasMany<PostHarvestAnalysis, $this>
     */
    public function postHarvestAnalyses(): HasMany
    {
        return $this->hasMany(PostHarvestAnalysis::class, 'user_id');
    }

    /**
     * @return HasMany<Report, $this>
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'user_id');
    }

    /**
     * @return HasMany<ExportHistory, $this>
     */
    public function exportHistory(): HasMany
    {
        return $this->hasMany(ExportHistory::class, 'user_id');
    }

    /**
     * @return HasMany<UploadedFile, $this>
     */
    public function uploadedFiles(): HasMany
    {
        return $this->hasMany(UploadedFile::class, 'user_id');
    }

    /**
     * @return HasMany<DashboardAnalytic, $this>
     */
    public function dashboardAnalytics(): HasMany
    {
        return $this->hasMany(DashboardAnalytic::class, 'user_id');
    }

    /**
     * @return HasMany<Notification, $this>
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    /**
     * @return HasMany<UserSetting, $this>
     */
    public function userSettings(): HasMany
    {
        return $this->hasMany(UserSetting::class, 'user_id');
    }

    /**
     * @return HasMany<LanguageSetting, $this>
     */
    public function languageSettings(): HasMany
    {
        return $this->hasMany(LanguageSetting::class, 'user_id');
    }

    /**
     * @return HasMany<ActivityLog, $this>
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }

    /**
     * @return HasMany<AuditLog, $this>
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'actor_user_id');
    }

    /**
     * @return HasMany<Feedback, $this>
     */
    public function feedback(): HasMany
    {
        return $this->hasMany(Feedback::class, 'user_id');
    }

    /**
     * @return HasMany<Testimonial, $this>
     */
    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class, 'user_id');
    }

    /**
     * @return HasMany<PredictionHistory, $this>
     */
    public function predictionHistory(): HasMany
    {
        return $this->hasMany(PredictionHistory::class, 'user_id');
    }

    /**
     * @return HasMany<ChatHistory, $this>
     */
    public function chatHistory(): HasMany
    {
        return $this->hasMany(ChatHistory::class, 'user_id');
    }

    /**
     * @return HasMany<ContactRequest, $this>
     */
    public function assignedContactRequests(): HasMany
    {
        return $this->hasMany(ContactRequest::class, 'assigned_to');
    }
}
