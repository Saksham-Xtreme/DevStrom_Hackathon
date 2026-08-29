const Medicine = require("../../models/Medicine");
const MedicationSchedule = require("../../models/MedicationSchedule");
const MedicationLog = require("../../models/MedicationLog");
const drugService = require("../../infrastructure/drugs/drug.services");

const WEEKDAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

const parseDoseNumber = (dose) => {
    if (typeof dose === "number") return dose;
    if (!dose) return 1;
    const match = String(dose).match(/\d+(\.\d+)?/);
    return match ? Number(match[0]) : 1;
};

const frequencyToDays = (frequency) => {
    // Most frequencies map to every day. "As needed" still shows daily slots.
    return WEEKDAYS.slice();
};

const toClientMedicine = (medicine, schedules = []) => {
    const plain = typeof medicine.toObject === "function" ? medicine.toObject() : medicine;

    return {
        id: plain._id,
        _id: plain._id,
        userId: plain.userId,
        name: plain.name,
        genericName: plain.genericName,
        brandName: plain.brandName,
        manufacturer: plain.manufacturer,
        strength: plain.strength,
        category: plain.category,
        frequency: plain.frequency,
        dosage: plain.dosage,
        dose: plain.dose,
        form: plain.form,
        instructions: plain.instructions,
        startDate: plain.startDate,
        endDate: plain.endDate,
        stock: plain.stock,
        expiryDate: plain.expiryDate,
        drugSctId: plain.drugSctId,
        genericSctId: plain.genericSctId,
        isActive: plain.isActive,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
        times: schedules.map((s) => s.time),
        schedules: schedules.map((s) => ({
            id: s._id,
            time: s.time,
            days: s.days,
            dose: s.dose,
            isActive: s.isActive,
        })),
    };
};

const searchMedicines = async (req, res, next) => {
    try {
        const { q, limit } = req.query;

        const result = await drugService.searchMedicines(
            q,
            Number(limit) || 10
        );

        res.json({
            success: true,
            data: result,
        });

        console.log(`[DRUGDB SEARCH] query=${q} count=${result?.results?.length || 0}`);
    } catch (error) {
        console.error("DrugDB search error:", error.message);
        next(error);
    }
};

const getMedicineDetails = async (req, res, next) => {
    try {
        const { sctId } = req.params;

        const medicine = await drugService.getMedicineDetails(sctId);

        res.json({
            success: true,
            data: medicine,
        });
    } catch (error) {
        console.error("DrugDB medicine details error:", error.message);
        next(error);
    }
};

const getMedicines = async (req, res, next) => {
    try {
        const medicines = await Medicine.find({
            userId: req.user._id,
            isActive: true,
        }).sort({ createdAt: -1 });

        const medicinesWithSchedules = await Promise.all(
            medicines.map(async (medicine) => {
                const schedules = await MedicationSchedule.find({
                    medicineId: medicine._id,
                    isActive: true,
                });

                return toClientMedicine(medicine, schedules);
            })
        );

        res.json({
            success: true,
            data: medicinesWithSchedules,
        });
    } catch (error) {
        console.error("Get medicines error:", error.message);
        next(error);
    }
};

const getMedicine = async (req, res, next) => {
    try {
        const medicine = await Medicine.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found",
            });
        }

        const schedules = await MedicationSchedule.find({
            medicineId: medicine._id,
            isActive: true,
        });

        res.json({
            success: true,
            data: toClientMedicine(medicine, schedules),
        });
    } catch (error) {
        console.error("Get medicine error:", error.message);
        next(error);
    }
};

const createMedicine = async (req, res, next) => {
    try {
        const {
            name,
            genericName,
            brandName,
            manufacturer,
            strength,
            category,
        frequency,
        dosage,
        form,
        instructions,
        startDate,
        endDate,
        stock,
        expiryDate,
        drugSctId,
        genericSctId,
        times = [],
        dose,
    } = req.body;

    if (!name || !startDate) {
        return res.status(400).json({
            success: false,
            message: "Medicine name and start date are required",
        });
    }

    const medicine = await Medicine.create({
        userId: req.user._id,
        name,
        genericName,
        brandName,
        manufacturer,
        strength,
        category,
        frequency,
        dosage: dosage || dose || strength,
        dose: dose || dosage || strength,
        form: form || "tablet",
            instructions,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            stock: stock !== undefined ? Number(stock) : 0,
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            drugSctId,
            genericSctId,
            isActive: true,
        });

        const days = frequencyToDays(frequency);
        const scheduleTimes = Array.isArray(times) ? times : String(times || "").split(",").map((t) => t.trim()).filter(Boolean);

        const createdSchedules = await MedicationSchedule.insertMany(
            scheduleTimes.map((time) => ({
                userId: req.user._id,
                medicineId: medicine._id,
                time,
                days,
                dose: parseDoseNumber(dose),
                isActive: true,
            }))
        );

        res.status(201).json({
            success: true,
            data: toClientMedicine(medicine, createdSchedules),
        });

        console.log(
            `[MEDICINE CREATE] userId=${req.user._id} name=${name} schedules=${createdSchedules.length}`
        );
    } catch (error) {
        console.error("Create medicine error:", error.message);
        next(error);
    }
};

const updateMedicine = async (req, res, next) => {
    try {
        const medicine = await Medicine.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found",
            });
        }

        const {
            name,
            genericName,
            brandName,
            manufacturer,
            strength,
            category,
        frequency,
        dosage,
        form,
        instructions,
        startDate,
        endDate,
        stock,
        expiryDate,
        drugSctId,
        genericSctId,
        times,
        dose,
        isActive,
    } = req.body;

    if (name !== undefined) medicine.name = name;
    if (genericName !== undefined) medicine.genericName = genericName;
    if (brandName !== undefined) medicine.brandName = brandName;
    if (manufacturer !== undefined) medicine.manufacturer = manufacturer;
    if (strength !== undefined) medicine.strength = strength;
    if (category !== undefined) medicine.category = category;
    if (frequency !== undefined) medicine.frequency = frequency;
    if (dosage !== undefined) medicine.dosage = dosage;
    if (dose !== undefined) medicine.dose = dose;
    if (form !== undefined) medicine.form = form;
        if (instructions !== undefined) medicine.instructions = instructions;
        if (startDate !== undefined) medicine.startDate = new Date(startDate);
        if (endDate !== undefined) medicine.endDate = endDate ? new Date(endDate) : undefined;
        if (stock !== undefined) medicine.stock = Number(stock);
        if (expiryDate !== undefined) medicine.expiryDate = expiryDate ? new Date(expiryDate) : undefined;
        if (drugSctId !== undefined) medicine.drugSctId = drugSctId;
        if (genericSctId !== undefined) medicine.genericSctId = genericSctId;
        if (isActive !== undefined) medicine.isActive = isActive;

        await medicine.save();

        // Rebuild schedules if times changed
        if (times !== undefined) {
            await MedicationSchedule.updateMany(
                { medicineId: medicine._id },
                { isActive: false }
            );

            const days = frequencyToDays(frequency || medicine.frequency);
            const scheduleTimes = Array.isArray(times)
                ? times
                : String(times || "").split(",").map((t) => t.trim()).filter(Boolean);

            const recreated = await MedicationSchedule.insertMany(
                scheduleTimes.map((time) => ({
                    userId: req.user._id,
                    medicineId: medicine._id,
                    time,
                    days,
                    dose: parseDoseNumber(dose !== undefined ? dose : 1),
                    isActive: true,
                }))
            );

            return res.json({
                success: true,
                data: toClientMedicine(medicine, recreated),
            });
        }

        const schedules = await MedicationSchedule.find({
            medicineId: medicine._id,
            isActive: true,
        });

        res.json({
            success: true,
            data: toClientMedicine(medicine, schedules),
        });
    } catch (error) {
        console.error("Update medicine error:", error.message);
        next(error);
    }
};

const deleteMedicine = async (req, res, next) => {
    try {
        const medicine = await Medicine.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found",
            });
        }

        medicine.isActive = false;
        await medicine.save();

        await MedicationSchedule.updateMany(
            { medicineId: medicine._id },
            { isActive: false }
        );

        res.json({
            success: true,
            message: "Medicine removed",
        });
    } catch (error) {
        console.error("Delete medicine error:", error.message);
        next(error);
    }
};

const getTodayDoses = async (req, res, next) => {
    try {
        const todayIndex = new Date().getDay();
        const todayWeekday = WEEKDAYS[todayIndex];

        const schedules = await MedicationSchedule.find({
            userId: req.user._id,
            isActive: true,
            days: todayWeekday,
        }).populate("medicineId");

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const entries = await Promise.all(
            schedules.map(async (schedule) => {
                const medicine = schedule.medicineId;

                if (!medicine || !medicine.isActive) {
                    return null;
                }

                const log = await MedicationLog.findOne({
                    userId: req.user._id,
                    scheduleId: schedule._id,
                    scheduledTime: { $gte: startOfDay, $lte: endOfDay },
                });

                return {
                    id: schedule._id,
                    scheduleId: schedule._id,
                    medicineId: medicine._id,
                    name: medicine.name,
                    strength: medicine.strength,
                    instructions: medicine.instructions,
                    time: schedule.time,
                    dose: schedule.dose,
                    status: log ? log.status : "upcoming",
                };
            })
        );

        res.json({
            success: true,
            data: entries.filter(Boolean).sort((a, b) =>
                a.time.localeCompare(b.time)
            ),
        });
    } catch (error) {
        console.error("Today doses error:", error.message);
        next(error);
    }
};

const logDose = async (req, res, next) => {
    try {
        const { scheduleId } = req.params;
        const { status } = req.body;

        if (!["TAKEN", "MISSED", "SKIPPED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid dose status",
            });
        }

        const schedule = await MedicationSchedule.findOne({
            _id: scheduleId,
            userId: req.user._id,
            isActive: true,
        });

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Schedule not found",
            });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existing = await MedicationLog.findOne({
            userId: req.user._id,
            scheduleId: schedule._id,
            scheduledTime: { $gte: startOfDay, $lte: endOfDay },
        });

        if (existing) {
            existing.status = status;
            existing.takenAt = status === "TAKEN" ? new Date() : undefined;
            await existing.save();

            return res.json({
                success: true,
                data: { id: existing._id, status: existing.status },
            });
        }

        const log = await MedicationLog.create({
            userId: req.user._id,
            medicineId: schedule.medicineId,
            scheduleId: schedule._id,
            scheduledTime: new Date(),
            status,
            takenAt: status === "TAKEN" ? new Date() : undefined,
        });

        res.json({
            success: true,
            data: { id: log._id, status: log.status },
        });
    } catch (error) {
        console.error("Log dose error:", error.message);
        next(error);
    }
};

module.exports = {
    searchMedicines,
    getMedicineDetails,
    getMedicines,
    getMedicine,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    getTodayDoses,
    logDose,
};
