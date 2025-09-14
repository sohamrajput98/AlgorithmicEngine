from app.models.feature_flag import FeatureFlag

class FeatureFlagService:
    def is_enabled(self, flag_key: str) -> bool:
        # Always True for now
        return True