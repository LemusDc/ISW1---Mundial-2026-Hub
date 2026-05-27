package com.mundial2026.album.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Table("stickers")
public class Sticker {
    @Id private Long id;
    @Column("code") private String code;
    @Column("name") private String name;
    @Column("team") private String team;
    @Column("category") private StickerCategory category;
    @Column("rarity") private StickerRarity rarity;
    @Column("image_url") private String imageUrl;
    @Column("description") private String description;
    @Column("page_number") private int pageNumber;

    public enum StickerCategory { PLAYER, STADIUM, TEAM_BADGE, GOLDEN_SPECIAL }
    public enum StickerRarity { COMMON, UNCOMMON, RARE, LEGENDARY }
}