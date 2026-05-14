package com.easylearn.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "school_course_whitelists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolCourseWhitelist {

    @EmbeddedId
    private SchoolCourseWhitelistId id;
}
