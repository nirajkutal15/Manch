package com.manch.service;
import com.manch.dto.request.CreateGigRequest;
import com.manch.dto.response.*;
import com.manch.entity.Gig;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Map;
public interface GigService {
    Page<GigResponse> findGigs(String city, Gig.GigType gigType, Gig.PayType payType, Pageable pageable);
    GigResponse findById(String id);
    GigResponse createGig(CreateGigRequest req);
    GigResponse updateGig(String id, Map<String,Object> updates);
    void cancelGig(String id);
    Page<GigResponse> getVenueGigs(Pageable pageable);
    ApplicationResponse applyToGig(String gigId, String note);
    Page<ApplicationResponse> getApplicationsForGig(String gigId, Pageable pageable);
    Page<ApplicationResponse> getMyApplications(Pageable pageable);
    ApplicationResponse reviewApplication(String appId, String status, String venueNote);
    ApplicationResponse withdrawApplication(String appId);
}
