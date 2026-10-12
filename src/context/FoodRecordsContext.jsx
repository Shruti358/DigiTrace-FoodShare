import React, { createContext, useContext, useState } from 'react';
import { 
  mockFoodRecords, 
  mockWasteRecords, 
  mockSurplusRecords, 
  mockSurplusListings, 
  mockRescueRequests, 
  getMockTraceForRecord 
} from '../data/mockData';

const FoodRecordsContext = createContext();

export function FoodRecordsProvider({ children }) {
  const [records, setRecords] = useState(mockFoodRecords);
  const [wasteLogs, setWasteLogs] = useState(mockWasteRecords);
  const [surplusLogs, setSurplusLogs] = useState(mockSurplusRecords);
  const [surplusListings, setSurplusListings] = useState(mockSurplusListings);
  const [rescueRequests, setRescueRequests] = useState(mockRescueRequests);
  const [selectedRecordId, setSelectedRecordId] = useState('DT-F-0001');

  // Add new food record (Enforces Prepared = Consumed + Surplus + Waste math)
  const addNewFoodRecord = (formData) => {
    const nextIdNum = records.length + 1;
    const newRecordId = formData.recordId || `DT-F-00${nextIdNum < 10 ? '0' + nextIdNum : nextIdNum}`;
    const nowTime = formData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const preparedNum = parseFloat(formData.foodPrepared) || 0;
    const consumedNum = parseFloat(formData.foodConsumed) || 0;
    const surplusNum = parseFloat(formData.surplus) || 0;
    const wasteNum = parseFloat(formData.waste) || 0;

    let statusText = "Consumed";
    let statusBgStyle = "bg-surface-container-low text-primary";

    if (surplusNum > 0) {
      statusText = "Available";
      statusBgStyle = "bg-emerald-100 text-emerald-800";
    } else if (wasteNum > 0) {
      statusText = "Composted";
      statusBgStyle = "bg-primary-fixed text-on-primary-fixed";
    }

    const newRecord = {
      recordId: newRecordId,
      date: formData.date || new Date().toISOString().split('T')[0],
      time: nowTime,
      station: formData.station || "Station #4 Line Alpha",
      mealType: formData.mealType || "Lunch",
      foodCategory: formData.foodCategory || "Proteins",
      itemName: formData.itemName || `${formData.foodCategory} Batch`,
      foodPrepared: preparedNum,
      foodConsumed: consumedNum,
      surplus: surplusNum,
      waste: wasteNum,
      status: statusText,
      statusBg: statusBgStyle
    };

    setRecords((prev) => [newRecord, ...prev]);

    // Create Waste Log if waste > 0
    if (wasteNum > 0) {
      const newWasteLog = {
        logId: `DT-W-010${wasteLogs.length + 1}`,
        recordId: newRecordId,
        date: newRecord.date,
        time: nowTime,
        item: `${formData.foodCategory} Scrap`,
        station: formData.station || "Station #4 Prep",
        category: formData.foodCategory || "Organic",
        weight: wasteNum,
        type: formData.wasteType || "Organic Scrap",
        cause: formData.wasteReason || "Prep Loss",
        stream: formData.handlingStream === 'compost' ? "Aerobic Digester" : "Municipal Compost",
        status: "Composted",
        statusBg: "bg-primary-fixed text-on-primary-fixed"
      };
      setWasteLogs((prev) => [newWasteLog, ...prev]);
    }

    // Create Surplus Listing & Log if surplus > 0
    if (surplusNum > 0) {
      const newSurplusId = `SRP-2026-00${surplusListings.length + 1}`;
      const newListing = {
        id: newSurplusId,
        recordId: newRecordId,
        title: newRecord.itemName,
        provider: "Grand Hotel & Conference Banquets",
        facilityId: "NODE-04",
        category: formData.foodCategory || "General",
        quantityKg: surplusNum,
        availableKg: surplusNum,
        servings: Math.round(surplusNum * 2.5),
        expiryWindow: "03h 00m",
        prepTime: `Today at ${nowTime}`,
        temp: "38°F (Chilled)",
        status: "Available",
        dietary: ["HACCP Insured", "Fresh Prep"],
        pickupAddress: "Loading Dock #2, North Bay",
        safetyCertified: true,
        haccpCode: `HCP-${Math.floor(100 + Math.random() * 900)}`,
        description: `Fresh surplus lot logged from ${formData.mealType || 'kitchen prep'}.`
      };

      const newSurplusLog = {
        surplusId: `DT-S-020${surplusLogs.length + 1}`,
        recordId: newRecordId,
        batch: newRecord.itemName,
        weight: surplusNum,
        temp: "38°F (Chilled)",
        readyTime: nowTime,
        recipient: "Surplus Exchange Network",
        courier: "Pending Claim Dispatch",
        status: "Available",
        statusBg: "bg-emerald-100 text-emerald-800"
      };

      setSurplusListings((prev) => [newListing, ...prev]);
      setSurplusLogs((prev) => [newSurplusLog, ...prev]);
    }

    return newRecord;
  };

  // Submit NGO Request for Surplus Batch
  const requestSurplusFood = (surplusId, requestData) => {
    const listing = surplusListings.find((s) => s.id === surplusId || s.recordId === surplusId);
    if (!listing) return null;

    const nextReqNum = rescueRequests.length + 1;
    const newRequestId = `REQ-2026-00${nextReqNum}`;

    const newRequest = {
      requestId: newRequestId,
      surplusId: listing.id,
      recordId: listing.recordId,
      itemTitle: listing.title,
      provider: listing.provider,
      ngoName: requestData.ngoName || "Hope Harbor Community Kitchen",
      ngoId: requestData.ngoId || "NGO-4491",
      ngoContact: requestData.ngoContact || "Sarah Jenkins (Director)",
      ngoPhone: requestData.ngoPhone || "+1 (555) 234-5678",
      requestedKg: parseFloat(requestData.requestedKg) || listing.quantityKg,
      estimatedMeals: Math.round((parseFloat(requestData.requestedKg) || listing.quantityKg) * 2.4),
      purpose: requestData.purpose || "Community Evening Meal Distribution",
      requestTime: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      pickupWindow: requestData.pickupWindow || "02:30 PM - 03:30 PM",
      courier: requestData.courier || "Hope Harbor Express Van",
      status: "Pending",
      rejectionReason: null,
      dockAccessCode: `DOCK-${Math.floor(1000 + Math.random() * 9000)}`,
      haccpVerified: true,
      receivedTime: null,
      distributedMeals: null,
      finalNotes: null
    };

    setRescueRequests((prev) => [newRequest, ...prev]);

    // Update Surplus Listing & Food Record Status
    setSurplusListings((prev) =>
      prev.map((item) => (item.id === listing.id ? { ...item, status: "Requested" } : item))
    );

    setRecords((prev) =>
      prev.map((rec) =>
        rec.recordId === listing.recordId
          ? { ...rec, status: "Requested", statusBg: "bg-amber-100 text-amber-900" }
          : rec
      )
    );

    return newRequest;
  };

  // Food Donor Accept Request
  const acceptRequest = (requestId, pickupWindowStr) => {
    setRescueRequests((prev) =>
      prev.map((req) => {
        if (req.requestId === requestId) {
          const updated = {
            ...req,
            status: "Pickup Scheduled",
            pickupWindow: pickupWindowStr || req.pickupWindow || "02:30 PM - 03:30 PM"
          };
          
          // Sync Listing & Food Record
          setSurplusListings((lPrev) =>
            lPrev.map((l) => (l.id === req.surplusId || l.recordId === req.recordId ? { ...l, status: "Pickup Scheduled" } : l))
          );
          setRecords((rPrev) =>
            rPrev.map((r) => (r.recordId === req.recordId ? { ...r, status: "Pickup Scheduled", statusBg: "bg-blue-100 text-blue-900" } : r))
          );

          return updated;
        }
        return req;
      })
    );
  };

  // Food Donor Reject Request
  const rejectRequest = (requestId, reasonText) => {
    setRescueRequests((prev) =>
      prev.map((req) => {
        if (req.requestId === requestId) {
          const updated = {
            ...req,
            status: "Rejected",
            rejectionReason: reasonText || "Holding window expired / lot allocated elsewhere."
          };

          // Revert Listing & Food Record to Available
          setSurplusListings((lPrev) =>
            lPrev.map((l) => (l.id === req.surplusId || l.recordId === req.recordId ? { ...l, status: "Available" } : l))
          );
          setRecords((rPrev) =>
            rPrev.map((r) => (r.recordId === req.recordId ? { ...r, status: "Available", statusBg: "bg-emerald-100 text-emerald-800" } : r))
          );

          return updated;
        }
        return req;
      })
    );
  };

  // Courier Picked Up
  const markPickedUp = (requestId) => {
    setRescueRequests((prev) =>
      prev.map((req) => {
        if (req.requestId === requestId) {
          const updated = { ...req, status: "Picked Up" };
          setSurplusListings((lPrev) =>
            lPrev.map((l) => (l.id === req.surplusId || l.recordId === req.recordId ? { ...l, status: "Picked Up" } : l))
          );
          setRecords((rPrev) =>
            rPrev.map((r) => (r.recordId === req.recordId ? { ...r, status: "Picked Up", statusBg: "bg-purple-100 text-purple-900" } : r))
          );
          return updated;
        }
        return req;
      })
    );
  };

  // NGO Confirm Received
  const confirmReceived = (requestId, notes) => {
    const timeStr = `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setRescueRequests((prev) =>
      prev.map((req) => {
        if (req.requestId === requestId) {
          const updated = { ...req, status: "Received", receivedTime: timeStr, finalNotes: notes };
          setSurplusListings((lPrev) =>
            lPrev.map((l) => (l.id === req.surplusId || l.recordId === req.recordId ? { ...l, status: "Received" } : l))
          );
          setRecords((rPrev) =>
            rPrev.map((r) => (r.recordId === req.recordId ? { ...r, status: "Received", statusBg: "bg-teal-100 text-teal-900" } : r))
          );
          return updated;
        }
        return req;
      })
    );
  };

  // NGO Record Distribution & Complete Workflow
  const recordDistribution = (requestId, mealsCount, notes) => {
    setRescueRequests((prev) =>
      prev.map((req) => {
        if (req.requestId === requestId) {
          const updated = {
            ...req,
            status: "Completed",
            distributedMeals: mealsCount || req.estimatedMeals,
            finalNotes: notes || "Fully distributed to community beneficiaries."
          };
          setSurplusListings((lPrev) =>
            lPrev.map((l) => (l.id === req.surplusId || l.recordId === req.recordId ? { ...l, status: "Completed", availableKg: 0 } : l))
          );
          setRecords((rPrev) =>
            rPrev.map((r) => (r.recordId === req.recordId ? { ...r, status: "Completed", statusBg: "bg-tertiary-fixed text-on-tertiary-fixed" } : r))
          );
          return updated;
        }
        return req;
      })
    );
  };

  // Mark Surplus Expired
  const markExpired = (listingId) => {
    setSurplusListings((prev) =>
      prev.map((item) => (item.id === listingId ? { ...item, status: "Expired", availableKg: 0 } : item))
    );
    setRecords((prev) =>
      prev.map((r) => (r.recordId === listingId || r.recordId === listingId ? { ...r, status: "Expired", statusBg: "bg-gray-200 text-gray-700" } : r))
    );
  };

  // Select record for trace details
  const getSelectedTraceDetails = () => {
    return getMockTraceForRecord(selectedRecordId, records, rescueRequests);
  };

  // Delete food record
  const deleteFoodRecord = (recordId) => {
    setRecords((prev) => prev.filter((r) => r.recordId !== recordId));
    setWasteLogs((prev) => prev.filter((w) => w.recordId !== recordId));
    setSurplusLogs((prev) => prev.filter((s) => s.recordId !== recordId));
    setSurplusListings((prev) => prev.filter((s) => s.recordId !== recordId && s.id !== recordId));
  };

  const updateFoodRecord = (recordId, updatedRecord) => {
    setRecords((prev) => {
      const recordExists = prev.some((record) => record.recordId === recordId);
      const updatedRecords = prev.map((record) =>
        record.recordId === recordId ? { ...record, ...updatedRecord } : record
      );
      return recordExists ? updatedRecords : [updatedRecord, ...updatedRecords];
    });

    setWasteLogs((prev) => {
      const otherLogs = prev.filter((log) => log.recordId !== recordId);
      if (updatedRecord.waste <= 0) return otherLogs;
      return [{
        logId: `DT-W-${recordId.replace(/\D/g, '')}`,
        recordId,
        date: updatedRecord.date,
        time: updatedRecord.time,
        item: `${updatedRecord.foodCategory} Scrap`,
        station: updatedRecord.station,
        category: updatedRecord.foodCategory,
        weight: updatedRecord.waste,
        type: updatedRecord.wasteType || 'Organic Scrap',
        cause: updatedRecord.wasteReason || 'Prep Loss',
        stream: updatedRecord.handlingStream === 'compost' ? 'Aerobic Digester' : 'Municipal Compost',
        status: 'Composted',
        statusBg: 'bg-primary-fixed text-on-primary-fixed',
      }, ...otherLogs];
    });

    setSurplusLogs((prev) => {
      const otherLogs = prev.filter((log) => log.recordId !== recordId);
      if (updatedRecord.surplus <= 0) return otherLogs;
      return [{
        surplusId: `DT-S-${recordId.replace(/\D/g, '')}`,
        recordId,
        batch: updatedRecord.itemName,
        weight: updatedRecord.surplus,
        temp: '38°F (Chilled)',
        readyTime: updatedRecord.time,
        recipient: 'Available on Marketplace',
        courier: 'Pending Claim Dispatch',
        status: 'Available',
        statusBg: 'bg-emerald-100 text-emerald-800',
      }, ...otherLogs];
    });

    setSurplusListings((prev) => {
      const matchingListing = prev.find((listing) => listing.recordId === recordId);
      const otherListings = prev.filter((listing) => listing.recordId !== recordId);
      if (updatedRecord.surplus <= 0) return otherListings;

      return [{
        id: matchingListing?.id || `SRP-${recordId}`,
        recordId,
        title: updatedRecord.itemName,
        provider: matchingListing?.provider || 'Food Provider',
        facilityId: matchingListing?.facilityId || 'NODE-04',
        category: updatedRecord.foodCategory,
        quantityKg: updatedRecord.surplus,
        availableKg: updatedRecord.surplus,
        servings: Math.round(updatedRecord.surplus * 2.5),
        expiryWindow: matchingListing?.expiryWindow || '03h 00m',
        prepTime: `${updatedRecord.date} ${updatedRecord.time}`,
        temp: matchingListing?.temp || '38°F (Chilled)',
        status: 'Available',
        dietary: matchingListing?.dietary || ['HACCP Insured', 'Fresh Prep'],
        pickupAddress: matchingListing?.pickupAddress || 'Loading Dock #2',
        safetyCertified: matchingListing?.safetyCertified ?? true,
        haccpCode: matchingListing?.haccpCode || 'Pending Audit',
        description: `Updated surplus from ${updatedRecord.mealType} food record.`,
      }, ...otherListings];
    });
  };

  return (
    <FoodRecordsContext.Provider
      value={{
        records,
        wasteLogs,
        surplusLogs,
        surplusListings,
        rescueRequests,
        selectedRecordId,
        setSelectedRecordId,
        getSelectedTraceDetails,
        addNewFoodRecord,
        updateFoodRecord,
        requestSurplusFood,
        acceptRequest,
        rejectRequest,
        markPickedUp,
        confirmReceived,
        recordDistribution,
        markExpired,
        deleteFoodRecord
      }}
    >
      {children}
    </FoodRecordsContext.Provider>
  );
}

export function useFoodRecords() {
  const context = useContext(FoodRecordsContext);
  if (!context) {
    throw new Error('useFoodRecords must be used within a FoodRecordsProvider');
  }
  return context;
}
